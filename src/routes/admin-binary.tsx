import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Power, Search, Download, Phone, MessageCircle, Lock, Terminal,
  ChevronDown, ChevronUp, Hexagon, AlertTriangle, RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/admin-binary")({
  head: () => ({
    meta: [
      { title: "⬡ Binary Command Center" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminBinary,
});

type Enrollment = {
  id: string;
  name: string;
  ssc_roll: string;
  school: string;
  mobile: string;
  batch: string | null;
  tier: string | null;
  status: "New" | "In Touch" | "Confirmed" | "Paid";
  notes: string | null;
  created_at: string;
};

const STATUSES = ["New", "In Touch", "Confirmed", "Paid"] as const;
const ADMIN_PW = (import.meta.env.VITE_ADMIN_PASSWORD as string) || "Binary2026";
const SESSION_KEY = "binary_admin_ok";

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  // BD time = UTC+6
  const bd = new Date(d.getTime() + (6 * 60 + d.getTimezoneOffset()) * 60000);
  const dd = String(bd.getDate()).padStart(2, "0");
  const mon = bd.toLocaleString("en-US", { month: "short" });
  const yyyy = bd.getFullYear();
  const hh = String(bd.getHours()).padStart(2, "0");
  const mm = String(bd.getMinutes()).padStart(2, "0");
  return `${dd} ${mon} ${yyyy}, ${hh}:${mm}`;
};

const waLink = (mobile: string) => {
  const digits = mobile.replace(/\D/g, "").replace(/^0+/, "");
  const withCC = digits.startsWith("880") ? digits : `880${digits}`;
  return `https://wa.me/${withCC}`;
};

function AdminBinary() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
        .cmd-font { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .cmd-bg { background: #0A0A0F; }
        .cmd-glass {
          background: linear-gradient(180deg, rgba(0,245,255,0.04), rgba(0,0,0,0.2));
          border: 1px solid rgba(0,245,255,0.25);
          box-shadow: 0 0 24px rgba(0,245,255,0.08), inset 0 0 24px rgba(0,245,255,0.04);
          backdrop-filter: blur(8px);
        }
        .cmd-glow-cyan { box-shadow: 0 0 20px rgba(0,245,255,0.5), 0 0 40px rgba(0,245,255,0.2); }
        .cmd-glow-green { box-shadow: 0 0 20px rgba(57,255,20,0.5), 0 0 40px rgba(57,255,20,0.2); }
        .cmd-glow-amber { box-shadow: 0 0 20px rgba(255,183,0,0.5), 0 0 40px rgba(255,183,0,0.2); }
        .cmd-glow-red { box-shadow: 0 0 20px rgba(255,59,59,0.6), 0 0 40px rgba(255,59,59,0.25); }
        @keyframes cmd-pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .cmd-pulse { animation: cmd-pulse 2s ease-in-out infinite; }
        @keyframes cmd-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        .cmd-cursor { animation: cmd-blink 1s steps(1) infinite; }
        @keyframes cmd-shake {
          0%,100%{transform:translateX(0)}
          20%,60%{transform:translateX(-8px)}
          40%,80%{transform:translateX(8px)}
        }
        .cmd-shake { animation: cmd-shake 0.4s ease; }
        @keyframes cmd-skeleton { 0%{opacity:0.3} 50%{opacity:0.7} 100%{opacity:0.3} }
        .cmd-skeleton { animation: cmd-skeleton 1.4s ease-in-out infinite; background: rgba(0,245,255,0.15); }
        .cmd-underline {
          background: linear-gradient(90deg, transparent, #00F5FF, transparent);
          height: 2px;
          box-shadow: 0 0 12px #00F5FF;
        }
        .row-paid { background: rgba(57,255,20,0.20) !important; }
        .row-confirmed { background: rgba(0,245,255,0.10) !important; }
        .row-intouch { background: rgba(255,183,0,0.10) !important; }
        .cmd-input {
          background: rgba(10,10,15,0.8);
          border: 1px solid rgba(0,245,255,0.3);
          color: #00F5FF;
          font-family: 'JetBrains Mono', monospace;
        }
        .cmd-input:focus { outline: none; border-color: #00F5FF; box-shadow: 0 0 12px rgba(0,245,255,0.5); }
      `}</style>
      <div className="min-h-screen cmd-bg cmd-font text-[#E8FBFF]">
        {!authed ? (
          <LoginGate onPass={() => { sessionStorage.setItem(SESSION_KEY, "1"); setAuthed(true); }} />
        ) : (
          <Dashboard onLogout={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }} />
        )}
      </div>
    </>
  );
}

function LoginGate({ onPass }: { onPass: () => void }) {
  const [pw, setPw] = useState("");
  const [shake, setShake] = useState(false);
  const [denied, setDenied] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PW) {
      onPass();
    } else {
      setShake(true);
      setDenied(true);
      setTimeout(() => setShake(false), 500);
      setPw("");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className={`cmd-glass rounded-lg p-8 w-full max-w-md ${shake ? "cmd-shake" : ""}`}>
        <div className="flex items-center gap-2 text-[#00F5FF] mb-6">
          <Terminal className="h-5 w-5" />
          <span className="text-xs uppercase tracking-widest">SYSTEM ACCESS</span>
        </div>
        <h1 className="text-2xl font-bold text-[#00F5FF] mb-1">⬡ BINARY COMMAND CENTER</h1>
        <p className="text-xs text-[#00F5FF]/60 mb-6">Authorized personnel only.</p>
        <label className="text-xs uppercase text-[#00F5FF]/80 mb-2 block">&gt; ENTER ACCESS KEY</label>
        <div className="flex items-center gap-2 cmd-input rounded px-3 py-3">
          <Lock className="h-4 w-4 text-[#00F5FF]/60" />
          <input
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => { setPw(e.target.value); setDenied(false); }}
            className="flex-1 bg-transparent outline-none text-[#00F5FF] tracking-widest"
            placeholder="••••••••"
          />
        </div>
        {denied && <p className="mt-3 text-[#FF3B3B] text-xs cmd-pulse">⛔ ACCESS DENIED — INVALID KEY</p>}
        <button
          type="submit"
          className="mt-6 w-full py-3 rounded bg-[#00F5FF] text-black font-bold uppercase tracking-widest hover:cmd-glow-cyan transition-all"
        >
          ▸ AUTHENTICATE
        </button>
      </form>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [rows, setRows] = useState<Enrollment[] | null>(null);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"All" | "New" | "In Touch" | "Confirmed" | "Paid" | "Hybrid Only">("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("enrollments" as never)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { setError(true); return; }
    setError(false);
    setRows((data ?? []) as Enrollment[]);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!error) return;
    const id = setInterval(load, 10_000);
    return () => clearInterval(id);
  }, [error]);

  const total = rows?.length ?? 0;
  const hybrid = rows?.filter(r => r.tier === "Offline Hybrid").length ?? 0;
  const taken = rows?.filter(r => r.status === "Confirmed" || r.status === "Paid").length ?? 0;
  const slotsLeft = 10 - taken;

  const filtered = useMemo(() => {
    let list = rows ?? [];
    if (filter === "Hybrid Only") list = list.filter(r => r.tier === "Offline Hybrid");
    else if (filter !== "All") list = list.filter(r => r.status === filter);
    if (q.trim()) {
      const n = q.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(n) ||
        r.ssc_roll.toLowerCase().includes(n) ||
        r.school.toLowerCase().includes(n),
      );
    }
    return list;
  }, [rows, q, filter]);

  const updateRow = async (id: string, patch: Partial<Enrollment>, label: string) => {
    const prev = rows;
    setRows(rs => rs?.map(r => r.id === id ? { ...r, ...patch } as Enrollment : r) ?? rs);
    const { error } = await supabase.from("enrollments" as never).update(patch).eq("id", id);
    if (error) {
      toast.error("Failed to update");
      setRows(prev);
    } else {
      toast.success(label);
    }
  };

  const exportCsv = () => {
    const cols: (keyof Enrollment)[] = ["name", "ssc_roll", "school", "batch", "tier", "mobile", "status", "notes", "created_at"];
    const esc = (v: any) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [cols.join(",")];
    filtered.forEach(r => lines.push(cols.map(c => esc(r[c])).join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `binary-enrollments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-[#00F5FF] flex items-center gap-2">
            <Hexagon className="h-6 w-6 md:h-8 md:w-8" /> BINARY COMMAND CENTER
          </h1>
          <div className="cmd-underline mt-1 w-40 md:w-64" />
          <p className="text-[10px] md:text-xs text-[#00F5FF]/60 mt-2 uppercase tracking-widest">
            Mukterpara · Netrokona · HSC ICT Operations
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded border border-[#FF3B3B] text-[#FF3B3B] hover:bg-[#FF3B3B] hover:text-black transition-all text-[10px] md:text-xs uppercase tracking-widest font-bold"
        >
          <Power className="h-3 w-3 md:h-4 md:w-4" /> <span className="hidden sm:inline">TERMINATE SESSION</span><span className="sm:hidden">EXIT</span>
        </button>
      </div>

      {/* Connection error */}
      {error && (
        <div className="mt-4 p-3 rounded border border-[#FF3B3B] bg-[#FF3B3B]/10 text-[#FF3B3B] flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4" /> ⚠ DATABASE LINK LOST — Retrying…
          <button onClick={load} className="ml-auto flex items-center gap-1 text-xs hover:underline">
            <RefreshCw className="h-3 w-3" /> Retry now
          </button>
        </div>
      )}

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-4">
        <StatTile label="TOTAL REGISTRATIONS" value={total} loading={rows === null} color="cyan" />
        <StatTile label="HYBRID INTEREST" value={hybrid} loading={rows === null} color="cyan" />
        <StatTile
          label="SLOTS LEFT"
          value={slotsLeft <= 0 ? "⛔ FULL" : slotsLeft}
          loading={rows === null}
          color={slotsLeft <= 0 ? "red" : slotsLeft <= 3 ? "amber" : "cyan"}
        />
      </div>

      {/* Tools */}
      <div className="mt-6 cmd-glass rounded-lg p-3 md:p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="flex items-center gap-2 cmd-input rounded px-3 py-2 flex-1">
            <Search className="h-4 w-4 text-[#00F5FF]/60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, SSC roll, school…"
              className="bg-transparent outline-none flex-1 text-[#E8FBFF] placeholder:text-[#00F5FF]/40 text-sm"
            />
          </div>
          <button
            onClick={exportCsv}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded border border-[#00F5FF] text-[#00F5FF] hover:bg-[#00F5FF] hover:text-black transition-all text-xs uppercase tracking-widest font-bold"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All","New","In Touch","Confirmed","Paid","Hybrid Only"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold transition-all ${
                filter === f
                  ? "bg-[#00F5FF] text-black cmd-glow-cyan"
                  : "border border-[#00F5FF]/40 text-[#00F5FF]/80 hover:border-[#00F5FF]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table / cards */}
      <div className="mt-4 cmd-glass rounded-lg overflow-hidden">
        {rows === null ? (
          <div className="p-6 space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded cmd-skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#00F5FF] text-sm uppercase tracking-widest">
              NO TRANSMISSIONS DETECTED<span className="cmd-cursor">_</span>
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#00F5FF]/5 text-[#00F5FF] uppercase tracking-wider">
                  <tr>
                    {["Name","SSC Roll","School","Batch","Tier","Mobile","Status","Notes","Created"].map(h => (
                      <th key={h} className="text-left px-3 py-2 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr
                      key={r.id}
                      className={`border-t border-[#00F5FF]/10 transition-colors ${
                        r.status === "Paid" ? "row-paid" :
                        r.status === "Confirmed" ? "row-confirmed" :
                        r.status === "In Touch" ? "row-intouch" : ""
                      }`}
                    >
                      <td className="px-3 py-2 font-bold text-[#E8FBFF]">{r.name}</td>
                      <td className="px-3 py-2">{r.ssc_roll}</td>
                      <td className="px-3 py-2">{r.school}</td>
                      <td className="px-3 py-2">{r.batch || "—"}</td>
                      <td className="px-3 py-2">{r.tier || "—"}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <span className="font-mono">{r.mobile}</span>
                          <a href={`tel:${r.mobile}`} className="p-1 rounded hover:bg-[#00F5FF]/20 text-[#00F5FF]" title="Call"><Phone className="h-3 w-3" /></a>
                          <a href={waLink(r.mobile)} target="_blank" rel="noreferrer" className="p-1 rounded hover:bg-[#39FF14]/20 text-[#39FF14]" title="WhatsApp"><MessageCircle className="h-3 w-3" /></a>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <StatusSelect value={r.status} onChange={(s) => updateRow(r.id, { status: s }, "✅ Status updated")} />
                      </td>
                      <td className="px-3 py-2 min-w-[180px]">
                        <NotesField value={r.notes} onSave={(n) => updateRow(r.id, { notes: n }, "✅ Notes saved")} />
                      </td>
                      <td className="px-3 py-2 text-[10px] text-[#00F5FF]/70 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[#00F5FF]/10">
              {filtered.map(r => {
                const open = expanded === r.id;
                return (
                  <div
                    key={r.id}
                    className={`p-3 ${
                      r.status === "Paid" ? "row-paid" :
                      r.status === "Confirmed" ? "row-confirmed" :
                      r.status === "In Touch" ? "row-intouch" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-[#E8FBFF] truncate">{r.name}</p>
                        <p className="text-[10px] text-[#00F5FF]/70 mt-0.5">{r.tier || r.batch || "—"}</p>
                      </div>
                      <button
                        onClick={() => setExpanded(open ? null : r.id)}
                        className="p-1 text-[#00F5FF]"
                        aria-label="expand"
                      >
                        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="font-mono text-[#00F5FF]">{r.mobile}</span>
                      <a href={`tel:${r.mobile}`} className="p-1.5 rounded bg-[#00F5FF]/10 text-[#00F5FF]"><Phone className="h-3.5 w-3.5" /></a>
                      <a href={waLink(r.mobile)} target="_blank" rel="noreferrer" className="p-1.5 rounded bg-[#39FF14]/10 text-[#39FF14]"><MessageCircle className="h-3.5 w-3.5" /></a>
                      <div className="ml-auto">
                        <StatusSelect value={r.status} onChange={(s) => updateRow(r.id, { status: s }, "✅ Status updated")} />
                      </div>
                    </div>
                    {open && (
                      <div className="mt-3 space-y-2 text-xs text-[#E8FBFF]/90">
                        <Row k="SSC Roll" v={r.ssc_roll} />
                        <Row k="School" v={r.school} />
                        <Row k="Batch" v={r.batch || "—"} />
                        <Row k="Created" v={fmtDate(r.created_at)} />
                        <div>
                          <p className="text-[10px] uppercase text-[#00F5FF]/70 mb-1">Notes</p>
                          <NotesField value={r.notes} onSave={(n) => updateRow(r.id, { notes: n }, "✅ Notes saved")} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <p className="text-[10px] text-[#00F5FF]/50 text-center mt-4 uppercase tracking-widest">
        Live count refreshes every 30s · {filtered.length} of {total} shown
      </p>
    </div>
  );
}

function StatTile({
  label, value, color, loading,
}: { label: string; value: number | string; color: "cyan" | "amber" | "red"; loading: boolean }) {
  const c = color === "red" ? "#FF3B3B" : color === "amber" ? "#FFB700" : "#00F5FF";
  const glow = color === "red" ? "cmd-glow-red" : color === "amber" ? "cmd-glow-amber" : "cmd-glow-cyan";
  return (
    <div className={`cmd-glass rounded-lg p-4 md:p-5 cmd-pulse ${glow}`} style={{ borderColor: `${c}80` }}>
      <p className="text-[10px] uppercase tracking-widest" style={{ color: c, opacity: 0.85 }}>{label}</p>
      <div className="mt-2 text-3xl md:text-4xl font-bold font-mono" style={{ color: c, textShadow: `0 0 18px ${c}` }}>
        {loading ? <span className="inline-block w-16 h-8 rounded cmd-skeleton" /> : value}
      </div>
    </div>
  );
}

function StatusSelect({
  value, onChange,
}: { value: Enrollment["status"]; onChange: (s: Enrollment["status"]) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Enrollment["status"])}
      className="cmd-input rounded px-2 py-1 text-[11px] uppercase tracking-wider"
    >
      {STATUSES.map(s => <option key={s} value={s} className="bg-[#0A0A0F]">{s}</option>)}
    </select>
  );
}

function NotesField({ value, onSave }: { value: string | null; onSave: (n: string) => void }) {
  const [v, setV] = useState(value ?? "");
  const init = useRef(value ?? "");
  useEffect(() => { setV(value ?? ""); init.current = value ?? ""; }, [value]);
  return (
    <input
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => { if (v !== init.current) onSave(v); }}
      placeholder="Add note…"
      className="cmd-input rounded px-2 py-1 text-xs w-full"
    />
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-[#00F5FF]/60 uppercase text-[10px]">{k}</span>
      <span className="text-right">{v}</span>
    </div>
  );
}
