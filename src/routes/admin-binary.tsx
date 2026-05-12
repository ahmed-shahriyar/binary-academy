import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Power, Search, Download, Phone, MessageCircle, Lock, Terminal,
  ChevronDown, ChevronUp, Hexagon, AlertTriangle, RefreshCw, Gift,
  TrendingUp, BarChart3, Target, Zap, X,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

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
  course: string | null;
  status: "New" | "In Touch" | "Confirmed" | "Paid" | "Gift Claimed";
  notes: string | null;
  created_at: string;
};

type GiftClaim = {
  id: string;
  full_name: string;
  whatsapp_number: string;
  created_at: string;
};

type CourseKey = "Online Pro" | "Hybrid" | "Flex";
const COURSES: CourseKey[] = ["Online Pro", "Hybrid", "Flex"];
const COURSE_PRICE: Record<CourseKey, number> = {
  "Online Pro": 2500,
  "Hybrid": 3500,
  "Flex": 1500,
};
const COURSE_COLOR: Record<CourseKey, string> = {
  "Online Pro": "#00F5FF",
  "Hybrid": "#A855F7",
  "Flex": "#FFB700",
};

const STATUSES = ["New", "In Touch", "Confirmed", "Paid", "Gift Claimed"] as const;
const ADMIN_PW = (import.meta.env.VITE_ADMIN_PASSWORD as string) || "Binary2026";
const SESSION_KEY = "binary_admin_ok";

const fmtBDT = (n: number) =>
  "৳ " + Math.round(n).toLocaleString("en-IN");

const normalizeMobile = (m: string) => m.replace(/\D/g, "").replace(/^880/, "").replace(/^0+/, "");

const fmtDate = (iso: string) => {
  const d = new Date(iso);
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

function inferCourse(r: Enrollment): CourseKey | null {
  if (r.course && (COURSES as string[]).includes(r.course)) return r.course as CourseKey;
  const t = (r.tier || "").toLowerCase();
  if (t.includes("hybrid")) return "Hybrid";
  if (t.includes("flex")) return "Flex";
  if (t.includes("online") || t.includes("pro")) return "Online Pro";
  return null;
}

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
        .cmd-glow-purple { box-shadow: 0 0 20px rgba(168,85,247,0.55), 0 0 40px rgba(168,85,247,0.22); }
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
        @keyframes cmd-fadein { from{opacity:0; transform: translateY(6px)} to{opacity:1; transform:none} }
        .cmd-fadein { animation: cmd-fadein 0.5s ease both; }
        .cmd-underline {
          background: linear-gradient(90deg, transparent, #00F5FF, transparent);
          height: 2px;
          box-shadow: 0 0 12px #00F5FF;
        }
        .row-paid { background: rgba(57,255,20,0.20) !important; }
        .row-confirmed { background: rgba(0,245,255,0.10) !important; }
        .row-intouch { background: rgba(255,183,0,0.10) !important; }
        .row-warn-amber { background: rgba(255,183,0,0.12) !important; }
        .row-warn-red { background: rgba(255,59,59,0.15) !important; }
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
    if (pw === ADMIN_PW) onPass();
    else { setShake(true); setDenied(true); setTimeout(() => setShake(false), 500); setPw(""); }
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
            type="password" autoFocus value={pw}
            onChange={(e) => { setPw(e.target.value); setDenied(false); }}
            className="flex-1 bg-transparent outline-none text-[#00F5FF] tracking-widest"
            placeholder="••••••••"
          />
        </div>
        {denied && <p className="mt-3 text-[#FF3B3B] text-xs cmd-pulse">⛔ ACCESS DENIED — INVALID KEY</p>}
        <button type="submit" className="mt-6 w-full py-3 rounded bg-[#00F5FF] text-black font-bold uppercase tracking-widest hover:cmd-glow-cyan transition-all">
          ▸ AUTHENTICATE
        </button>
      </form>
    </div>
  );
}

type TabKey = "enrollments" | "gifts" | "analytics";

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [rows, setRows] = useState<Enrollment[] | null>(null);
  const [gifts, setGifts] = useState<GiftClaim[] | null>(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<TabKey>("enrollments");

  const load = async () => {
    const [e, g] = await Promise.all([
      supabase.from("enrollments" as never).select("*").order("created_at", { ascending: false }),
      supabase.from("gift_claims" as never).select("*").order("created_at", { ascending: false }),
    ]);
    if (e.error) { setError(true); return; }
    setError(false);
    setRows((e.data ?? []) as Enrollment[]);
    setGifts((g.data ?? []) as GiftClaim[]);
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

  const enrolledMobiles = useMemo(
    () => new Set((rows ?? []).map(r => normalizeMobile(r.mobile))),
    [rows],
  );

  const total = rows?.length ?? 0;
  const hybrid = rows?.filter(r => inferCourse(r) === "Hybrid").length ?? 0;
  const taken = rows?.filter(r => r.status === "Confirmed" || r.status === "Paid").length ?? 0;
  const slotsLeft = 10 - taken;
  const giftCount = gifts?.length ?? 0;

  const convertedFromGifts = useMemo(() => {
    if (!gifts || !rows) return 0;
    const eMap = new Map<string, Enrollment>();
    rows.forEach(r => eMap.set(normalizeMobile(r.mobile), r));
    let n = 0;
    gifts.forEach(g => {
      const e = eMap.get(normalizeMobile(g.whatsapp_number));
      if (e && (e.status === "Confirmed" || e.status === "Paid")) n++;
    });
    return n;
  }, [gifts, rows]);

  const conversionRate = giftCount === 0 ? null : (convertedFromGifts / giftCount) * 100;

  const updateRow = async (id: string, patch: Partial<Enrollment>, label: string) => {
    const prev = rows;
    setRows(rs => rs?.map(r => r.id === id ? { ...r, ...patch } as Enrollment : r) ?? rs);
    const { error } = await (supabase.from("enrollments" as never) as any).update(patch).eq("id", id);
    if (error) { toast.error("Failed to update"); setRows(prev); }
    else toast.success(label);
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
        <button onClick={onLogout} className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded border border-[#FF3B3B] text-[#FF3B3B] hover:bg-[#FF3B3B] hover:text-black transition-all text-[10px] md:text-xs uppercase tracking-widest font-bold">
          <Power className="h-3 w-3 md:h-4 md:w-4" /> <span className="hidden sm:inline">TERMINATE SESSION</span><span className="sm:hidden">EXIT</span>
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded border border-[#FF3B3B] bg-[#FF3B3B]/10 text-[#FF3B3B] flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4" /> ⚠ DATABASE LINK LOST — Retrying…
          <button onClick={load} className="ml-auto flex items-center gap-1 text-xs hover:underline">
            <RefreshCw className="h-3 w-3" /> Retry now
          </button>
        </div>
      )}

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mt-4">
        <StatTile label="TOTAL REGISTRATIONS" value={total} loading={rows === null} color="cyan" />
        <StatTile label="HYBRID INTEREST" value={hybrid} loading={rows === null} color="cyan" />
        <StatTile label="SLOTS LEFT" value={slotsLeft <= 0 ? "⛔ FULL" : slotsLeft} loading={rows === null}
          color={slotsLeft <= 0 ? "red" : slotsLeft <= 3 ? "amber" : "cyan"} />
        <StatTile label="🎁 GIFT CLAIMERS" value={giftCount} loading={gifts === null} color="purple" />
        <StatTile
          label="📈 CONVERSION RATE"
          value={conversionRate === null ? "N/A" : `${conversionRate.toFixed(1)}%`}
          loading={rows === null || gifts === null}
          color={conversionRate === null ? "cyan" : conversionRate > 40 ? "green" : conversionRate >= 20 ? "amber" : "red"}
        />
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto">
        <TabBtn active={tab === "enrollments"} onClick={() => setTab("enrollments")}>ENROLLMENTS</TabBtn>
        <TabBtn active={tab === "gifts"} onClick={() => setTab("gifts")}>🎁 GIFT CLAIMS</TabBtn>
        <TabBtn active={tab === "analytics"} onClick={() => setTab("analytics")}>📊 ANALYTICS</TabBtn>
      </div>

      <div className="mt-4 cmd-fadein">
        {tab === "enrollments" && (
          <EnrollmentsTab rows={rows} updateRow={updateRow} enrolledMobiles={enrolledMobiles} gifts={gifts} />
        )}
        {tab === "gifts" && (
          <GiftClaimsTab gifts={gifts} rows={rows} reload={load} />
        )}
        {tab === "analytics" && (
          <AnalyticsTab rows={rows} gifts={gifts} />
        )}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-t-lg text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-all ${
        active ? "bg-[#00F5FF] text-black cmd-glow-cyan" : "border border-[#00F5FF]/40 text-[#00F5FF]/80 hover:border-[#00F5FF]"
      }`}>{children}</button>
  );
}

/* ───────── ENROLLMENTS TAB ───────── */
type CourseFilter = "All" | CourseKey | "Partial - Gift Only";

function isPartialGiftOnly(r: Enrollment) {
  return r.status === "Gift Claimed" || (!r.ssc_roll?.trim() && !r.school?.trim());
}

function EnrollmentsTab({
  rows, updateRow, enrolledMobiles, gifts,
}: {
  rows: Enrollment[] | null;
  updateRow: (id: string, patch: Partial<Enrollment>, label: string) => void;
  enrolledMobiles: Set<string>;
  gifts: GiftClaim[] | null;
}) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | typeof STATUSES[number]>("All");
  const [courseFilter, setCourseFilter] = useState<CourseFilter>("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [growthOpen, setGrowthOpen] = useState(false);

  const giftMobileSet = useMemo(
    () => new Set((gifts ?? []).map(g => normalizeMobile(g.whatsapp_number))),
    [gifts],
  );

  // base list with course inferred
  const decorated = useMemo(() =>
    (rows ?? []).map(r => ({
      r,
      course: inferCourse(r),
      isGiftClaimer: giftMobileSet.has(normalizeMobile(r.mobile)),
      partial: isPartialGiftOnly(r),
    })),
    [rows, giftMobileSet],
  );

  // Search-applied list (for count-badges & display)
  const afterSearch = useMemo(() => {
    if (!q.trim()) return decorated;
    const n = q.toLowerCase();
    return decorated.filter(({ r }) =>
      r.name.toLowerCase().includes(n) ||
      r.ssc_roll.toLowerCase().includes(n) ||
      r.school.toLowerCase().includes(n) ||
      r.mobile.toLowerCase().includes(n),
    );
  }, [decorated, q]);

  const counts = useMemo(() => {
    const c: Record<CourseFilter, number> = { "All": afterSearch.length, "Online Pro": 0, "Hybrid": 0, "Flex": 0, "Partial - Gift Only": 0 };
    afterSearch.forEach(({ r, course, partial }) => {
      if (course) c[course]++;
      if (partial) c["Partial - Gift Only"]++;
    });
    return c;
  }, [afterSearch]);

  const filtered = useMemo(() => {
    let list = afterSearch;
    if (courseFilter === "Partial - Gift Only") {
      list = list.filter(({ partial }) => partial);
    } else if (courseFilter !== "All") {
      list = list.filter(({ course }) => course === courseFilter);
    }
    if (statusFilter !== "All") list = list.filter(({ r }) => r.status === statusFilter);
    return list;
  }, [afterSearch, courseFilter, statusFilter]);

  const exportCsv = () => {
    const cols: (keyof Enrollment)[] = ["name", "ssc_roll", "school", "batch", "course", "tier", "mobile", "status", "notes", "created_at"];
    const esc = (v: any) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const lines = [cols.join(",")];
    filtered.forEach(({ r }) => lines.push(cols.map(c => esc(r[c])).join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `binary-enrollments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Tools */}
      <div className="cmd-glass rounded-lg p-3 md:p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="flex items-center gap-2 cmd-input rounded px-3 py-2 flex-1">
            <Search className="h-4 w-4 text-[#00F5FF]/60" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, SSC roll, school, mobile…"
              className="bg-transparent outline-none flex-1 text-[#E8FBFF] placeholder:text-[#00F5FF]/40 text-sm" />
          </div>
          <button onClick={exportCsv} className="flex items-center justify-center gap-2 px-4 py-2 rounded border border-[#00F5FF] text-[#00F5FF] hover:bg-[#00F5FF] hover:text-black transition-all text-xs uppercase tracking-widest font-bold">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
        {/* Course filter pills */}
        <div className="flex flex-wrap gap-2">
          {(["All", "Online Pro", "Hybrid", "Flex", "Partial - Gift Only"] as CourseFilter[]).map(f => (
            <button key={f} onClick={() => setCourseFilter(f)}
              className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                courseFilter === f
                  ? "bg-[#00F5FF]/15 border-2 border-[#00F5FF] text-[#00F5FF] cmd-glow-cyan"
                  : "border border-[#00F5FF]/40 text-[#00F5FF]/80 hover:border-[#00F5FF]"
              }`}>
              {f} <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40">{counts[f]}</span>
            </button>
          ))}
        </div>
        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {(["All", ...STATUSES] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all ${
                statusFilter === f ? "bg-[#00F5FF] text-black" : "border border-[#00F5FF]/30 text-[#00F5FF]/70 hover:border-[#00F5FF]"
              }`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Table / cards */}
      <div className="mt-4 cmd-glass rounded-lg overflow-hidden">
        {rows === null ? (
          <div className="p-6 space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded cmd-skeleton" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#00F5FF] text-sm uppercase tracking-widest">NO TRANSMISSIONS DETECTED<span className="cmd-cursor">_</span></p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#00F5FF]/5 text-[#00F5FF] uppercase tracking-wider">
                  <tr>
                    {["Name","SSC Roll","School","Batch","Course","Mobile","Status","Notes","Created"].map(h => (
                      <th key={h} className="text-left px-3 py-2 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(({ r, course, partial }) => (
                    <tr key={r.id} className={`border-t border-[#00F5FF]/10 transition-colors ${
                      partial ? "row-warn-amber" :
                      r.status === "Paid" ? "row-paid" : r.status === "Confirmed" ? "row-confirmed" : r.status === "In Touch" ? "row-intouch" : ""
                    }`}>
                      <td className="px-3 py-2 font-bold text-[#E8FBFF]">
                        {r.name}
                        {partial && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFB700]/20 text-[#FFB700] border border-[#FFB700]/50 align-middle">
                            🎁 PARTIAL
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">{r.ssc_roll || <span className="text-[#FFB700]/70">—</span>}</td>
                      <td className="px-3 py-2">{r.school || <span className="text-[#FFB700]/70">—</span>}</td>
                      <td className="px-3 py-2">{r.batch || "—"}</td>
                      <td className="px-3 py-2">
                        {course ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: `${COURSE_COLOR[course]}22`, color: COURSE_COLOR[course], border: `1px solid ${COURSE_COLOR[course]}55` }}>{course}</span>
                        ) : <span className="text-[#00F5FF]/50">—</span>}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <span className="font-mono">{r.mobile}</span>
                          <a href={`tel:${r.mobile}`} className="p-1 rounded hover:bg-[#00F5FF]/20 text-[#00F5FF]"><Phone className="h-3 w-3" /></a>
                          <a href={waLink(r.mobile)} target="_blank" rel="noreferrer" className="p-1 rounded hover:bg-[#39FF14]/20 text-[#39FF14]" title={partial ? "Follow up — partial gift claim" : ""}><MessageCircle className="h-3 w-3" /></a>
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
            <div className="md:hidden divide-y divide-[#00F5FF]/10">
              {filtered.map(({ r, course, partial }) => {
                const open = expanded === r.id;
                return (
                  <div key={r.id} className={`p-3 ${
                    partial ? "row-warn-amber" :
                    r.status === "Paid" ? "row-paid" : r.status === "Confirmed" ? "row-confirmed" : r.status === "In Touch" ? "row-intouch" : ""
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-[#E8FBFF] truncate">
                          {r.name}
                          {partial && <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFB700]/20 text-[#FFB700] border border-[#FFB700]/50">🎁 PARTIAL</span>}
                        </p>
                        <p className="text-[10px] text-[#00F5FF]/70 mt-0.5">{course || r.tier || r.batch || (partial ? "Gift Claim Only · Follow up" : "—")}</p>
                      </div>
                      <button onClick={() => setExpanded(open ? null : r.id)} className="p-1 text-[#00F5FF]">
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
                        <Row k="Course" v={course || "—"} />
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
        Live count refreshes every 30s · {filtered.length} of {rows?.length ?? 0} shown
      </p>

      {/* Growth Tools */}
      <div className="mt-6">
        <button onClick={() => setGrowthOpen(o => !o)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg cmd-glass text-[#00F5FF] font-bold uppercase tracking-widest text-xs">
          <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> ⚡ GROWTH TOOLS</span>
          {growthOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {growthOpen && rows && (
          <div className="mt-3 space-y-4 cmd-fadein">
            <FollowUpQueue rows={rows} />
            <TodaysLeads rows={rows} />
            <RevenueEstimator rows={rows} />
          </div>
        )}
      </div>
    </>
  );
}

/* ───────── GIFT CLAIMS TAB ───────── */
function GiftClaimsTab({ gifts, rows, reload }: { gifts: GiftClaim[] | null; rows: Enrollment[] | null; reload: () => void }) {
  const [convertTarget, setConvertTarget] = useState<GiftClaim | null>(null);

  const enrollMap = useMemo(() => {
    const m = new Map<string, Enrollment>();
    (rows ?? []).forEach(r => m.set(normalizeMobile(r.mobile), r));
    return m;
  }, [rows]);

  if (gifts === null || rows === null) {
    return <div className="cmd-glass rounded-lg p-6 space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded cmd-skeleton" />)}</div>;
  }

  const decorated = gifts.map(g => {
    const e = enrollMap.get(normalizeMobile(g.whatsapp_number));
    return { g, e, course: e ? inferCourse(e) : null };
  });

  const unconverted = decorated
    .filter(d => !d.e)
    .sort((a, b) => +new Date(a.g.created_at) - +new Date(b.g.created_at));

  return (
    <div className="space-y-6">
      <div className="cmd-glass rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#00F5FF]/15 flex items-center gap-2 text-[#00F5FF] uppercase tracking-widest text-xs font-bold">
          <Gift className="h-4 w-4" /> GIFT CLAIMS — {gifts.length} TOTAL
        </div>
        {gifts.length === 0 ? (
          <div className="p-12 text-center text-[#00F5FF] text-sm uppercase tracking-widest">NO GIFT CLAIMS YET<span className="cmd-cursor">_</span></div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#00F5FF]/5 text-[#00F5FF] uppercase tracking-wider">
                  <tr>
                    {["Full Name", "WhatsApp", "Claimed At", "Enrolled?", "Actions"].map(h => (
                      <th key={h} className="text-left px-3 py-2 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {decorated.map(({ g, e, course }) => (
                    <tr key={g.id} className="border-t border-[#00F5FF]/10">
                      <td className="px-3 py-2 font-bold text-[#E8FBFF]">{g.full_name}</td>
                      <td className="px-3 py-2 font-mono">{g.whatsapp_number}</td>
                      <td className="px-3 py-2 text-[10px] text-[#00F5FF]/70 whitespace-nowrap">{fmtDate(g.created_at)}</td>
                      <td className="px-3 py-2">
                        {e ? (
                          <span className="px-2 py-1 rounded text-[10px] font-bold bg-[#00F5FF]/15 text-[#00F5FF] border border-[#00F5FF]/50">
                            ✅ Enrolled{course ? ` · ${course}` : ""}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-[10px] font-bold bg-[#FFB700]/15 text-[#FFB700] border border-[#FFB700]/50">⏳ Not Yet</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <a href={waLink(g.whatsapp_number)} target="_blank" rel="noreferrer" className="p-1.5 rounded bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/25"><MessageCircle className="h-3.5 w-3.5" /></a>
                          {!e && (
                            <button onClick={() => setConvertTarget(g)} className="px-2 py-1 rounded bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/50 hover:bg-[#A855F7]/30 text-[10px] font-bold flex items-center gap-1">
                              <Target className="h-3 w-3" /> Convert
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-[#00F5FF]/10">
              {decorated.map(({ g, e, course }) => (
                <div key={g.id} className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold truncate">{g.full_name}</p>
                      <p className="font-mono text-[#00F5FF] text-xs">{g.whatsapp_number}</p>
                      <p className="text-[10px] text-[#00F5FF]/70 mt-0.5">{fmtDate(g.created_at)}</p>
                    </div>
                    {e ? (
                      <span className="px-2 py-1 rounded text-[9px] font-bold bg-[#00F5FF]/15 text-[#00F5FF] border border-[#00F5FF]/50 whitespace-nowrap">✅{course ? ` ${course}` : ""}</span>
                    ) : (
                      <span className="px-2 py-1 rounded text-[9px] font-bold bg-[#FFB700]/15 text-[#FFB700] border border-[#FFB700]/50">⏳ Not Yet</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={waLink(g.whatsapp_number)} target="_blank" rel="noreferrer" className="p-1.5 rounded bg-[#39FF14]/10 text-[#39FF14]"><MessageCircle className="h-3.5 w-3.5" /></a>
                    {!e && (
                      <button onClick={() => setConvertTarget(g)} className="px-3 py-1.5 rounded bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/50 text-[10px] font-bold flex items-center gap-1">
                        <Target className="h-3 w-3" /> Convert
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Priority queue */}
      <div className="cmd-glass rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#FF3B3B]/30 flex items-center gap-2 text-[#FF3B3B] uppercase tracking-widest text-xs font-bold">
          🎯 UNCONVERTED GIFT CLAIMERS — FOLLOW UP NOW ({unconverted.length})
        </div>
        {unconverted.length === 0 ? (
          <div className="p-8 text-center text-[#00F5FF]/60 text-sm uppercase tracking-widest">ALL CLAIMERS CONVERTED 🎉</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#FF3B3B]/5 text-[#FF3B3B] uppercase tracking-wider">
                <tr>{["Name", "WhatsApp", "Days Since Claim", ""].map(h => <th key={h} className="text-left px-3 py-2 font-bold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {unconverted.map(({ g }) => {
                  const days = Math.floor((Date.now() - +new Date(g.created_at)) / 86400000);
                  const cls = days >= 14 ? "row-warn-red" : days >= 7 ? "row-warn-amber" : "";
                  return (
                    <tr key={g.id} className={`border-t border-[#00F5FF]/10 ${cls}`}>
                      <td className="px-3 py-2 font-bold">{g.full_name}</td>
                      <td className="px-3 py-2 font-mono">{g.whatsapp_number}</td>
                      <td className="px-3 py-2 font-bold">
                        {days}d {days >= 14 && <span className="ml-2 px-1.5 py-0.5 text-[9px] rounded bg-[#FF3B3B] text-black">🔴 COLD LEAD</span>}
                      </td>
                      <td className="px-3 py-2">
                        <a href={waLink(g.whatsapp_number)} target="_blank" rel="noreferrer" className="p-1.5 rounded bg-[#39FF14]/10 text-[#39FF14] inline-flex"><MessageCircle className="h-3.5 w-3.5" /></a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {convertTarget && (
        <ConvertModal claim={convertTarget} onClose={() => setConvertTarget(null)} onDone={() => { setConvertTarget(null); reload(); }} />
      )}
    </div>
  );
}

function ConvertModal({ claim, onClose, onDone }: { claim: GiftClaim; onClose: () => void; onDone: () => void }) {
  const [course, setCourse] = useState<CourseKey>("Online Pro");
  const [batch, setBatch] = useState("");
  const [sscRoll, setSscRoll] = useState("");
  const [school, setSchool] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batch || !sscRoll || !school) { toast.error("Fill all fields"); return; }
    setBusy(true);
    const { error } = await (supabase.from("enrollments" as never) as any).insert({
      name: claim.full_name, mobile: claim.whatsapp_number,
      ssc_roll: sscRoll, school, batch, course, tier: course, status: "New",
    });
    setBusy(false);
    if (error) { toast.error(error.message || "Failed"); return; }
    toast.success("✅ Student moved to Enrollments");
    onDone();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="cmd-glass rounded-lg p-6 w-full max-w-md cmd-fadein">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#A855F7] flex items-center gap-2"><Target className="h-5 w-5" /> CONVERT TO STUDENT</h3>
            <p className="text-xs text-[#00F5FF]/60 mt-1">{claim.full_name} · {claim.whatsapp_number}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-[#00F5FF]/70 hover:text-[#FF3B3B]"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] uppercase text-[#00F5FF]/70">Course</label>
            <select value={course} onChange={(e) => setCourse(e.target.value as CourseKey)} className="cmd-input rounded px-2 py-2 w-full mt-1">
              {COURSES.map(c => <option key={c} value={c} className="bg-[#0A0A0F]">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase text-[#00F5FF]/70">Batch</label>
            <input value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="e.g. Morning A" className="cmd-input rounded px-2 py-2 w-full mt-1" />
          </div>
          <div>
            <label className="text-[10px] uppercase text-[#00F5FF]/70">SSC Roll</label>
            <input value={sscRoll} onChange={(e) => setSscRoll(e.target.value)} className="cmd-input rounded px-2 py-2 w-full mt-1" />
          </div>
          <div>
            <label className="text-[10px] uppercase text-[#00F5FF]/70">School</label>
            <input value={school} onChange={(e) => setSchool(e.target.value)} className="cmd-input rounded px-2 py-2 w-full mt-1" />
          </div>
        </div>
        <button type="submit" disabled={busy}
          className="mt-5 w-full py-3 rounded bg-[#A855F7] text-black font-bold uppercase tracking-widest text-sm disabled:opacity-50">
          {busy ? "Converting…" : "▸ Convert to Enrollment"}
        </button>
      </form>
    </div>
  );
}

/* ───────── ANALYTICS TAB ───────── */
function AnalyticsTab({ rows: rowsIn, gifts: giftsIn }: { rows: Enrollment[] | null; gifts: GiftClaim[] | null }) {
  const loading = rowsIn === null || giftsIn === null;
  const rows = rowsIn ?? [];
  const gifts = giftsIn ?? [];


  // Chart 1: timeline last 30 days
  const timeline = useMemo(() => {
    const days: { d: string; total: number; paid: number }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ d: key.slice(5), total: 0, paid: 0 });
    }
    const idx = new Map(days.map((x, i) => [x.d, i]));
    rows.forEach(r => {
      const k = r.created_at.slice(5, 10);
      const i = idx.get(k); if (i === undefined) return;
      days[i].total++;
      if (r.status === "Paid") days[i].paid++;
    });
    return days;
  }, [rows]);

  // Chart 2: course distribution
  const dist = useMemo(() => {
    const c: Record<string, number> = { "Online Pro": 0, "Hybrid": 0, "Flex": 0, "Gift Only": 0 };
    rows.forEach(r => {
      const k = inferCourse(r);
      if (k) c[k]++; else c["Gift Only"]++;
    });
    return Object.entries(c).map(([name, value]) => ({ name, value }));
  }, [rows]);

  // Chart 3: status funnel
  const funnel = useMemo(() => STATUSES.map(s => ({ status: s, count: rows.filter(r => r.status === s).length })), [rows]);

  // Chart 4: gift conversion by week (last 8 weeks)
  const weekly = useMemo(() => {
    const weeks: { wk: string; converted: number; claims: number }[] = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const start = new Date(now); start.setDate(now.getDate() - i * 7 - 6);
      const end = new Date(now); end.setDate(now.getDate() - i * 7);
      weeks.push({ wk: `W${8 - i}`, converted: 0, claims: 0 });
      const wIdx = weeks.length - 1;
      gifts.forEach(g => {
        const t = +new Date(g.created_at);
        if (t >= +start && t <= +end) {
          weeks[wIdx].claims++;
          const e = rows.find(r => normalizeMobile(r.mobile) === normalizeMobile(g.whatsapp_number));
          if (e && e.status === "Paid") weeks[wIdx].converted++;
        }
      });
    }
    return weeks;
  }, [rows, gifts]);

  // Chart 5: heatmap 4 weeks x 7 days
  const heatmap = useMemo(() => {
    const cells: number[][] = Array.from({ length: 4 }, () => Array(7).fill(0));
    const now = new Date();
    rows.forEach(r => {
      const t = new Date(r.created_at);
      const diffDays = Math.floor((+now - +t) / 86400000);
      if (diffDays < 0 || diffDays >= 28) return;
      const week = 3 - Math.floor(diffDays / 7);
      const dayOfWeek = (t.getDay() + 6) % 7; // Mon=0
      cells[week][dayOfWeek]++;
    });
    const max = Math.max(1, ...cells.flat());
    return { cells, max };
  }, [rows]);

  // Chart 6: revenue stacked
  const revenue = useMemo(() => {
    const calc = (filterFn: (r: Enrollment) => boolean) => rows.filter(filterFn).reduce((s, r) => {
      const c = inferCourse(r); return s + (c ? COURSE_PRICE[c] : 0);
    }, 0);
    const collected = calc(r => r.status === "Paid");
    const confirmed = calc(r => r.status === "Confirmed");
    const potential = calc(() => true);
    return [
      { name: "Collected", value: collected, fill: "#39FF14" },
      { name: "Confirmed", value: confirmed, fill: "#00F5FF" },
      { name: "Potential", value: potential, fill: "#888888" },
    ];
  }, [rows]);

  const empty = !loading && rows.length === 0;
  if (loading) return <div className="cmd-glass rounded-lg p-6 space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-32 rounded cmd-skeleton" />)}</div>;

  const grid = "rgba(0,245,255,0.15)";
  const tickStyle = { fill: "#00F5FF", fontSize: 10, fontFamily: "JetBrains Mono, monospace" } as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCard title="📈 ENROLLMENT TIMELINE (30 DAYS)" empty={empty}>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={timeline}>
            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
            <XAxis dataKey="d" tick={tickStyle as any} />
            <YAxis tick={tickStyle as any} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#0A0A0F", border: "1px solid #00F5FF", fontFamily: "JetBrains Mono" }} />
            <Legend wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 10 }} />
            <Line type="monotone" dataKey="total" stroke="#00F5FF" strokeWidth={2} dot={false} animationDuration={900} />
            <Line type="monotone" dataKey="paid" stroke="#39FF14" strokeWidth={2} dot={false} animationDuration={900} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="🍩 COURSE DISTRIBUTION" empty={empty}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={dist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} animationDuration={900}>
              {dist.map((d, i) => (
                <Cell key={i} fill={(COURSE_COLOR as any)[d.name] || "#888"} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#0A0A0F", border: "1px solid #00F5FF", fontFamily: "JetBrains Mono" }}
              formatter={(v: any, n: any) => [`${v} (${rows.length ? ((v / rows.length) * 100).toFixed(1) : 0}%)`, n]} />
            <Legend wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="📊 STUDENT STATUS FUNNEL" empty={empty}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={funnel} layout="vertical">
            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
            <XAxis type="number" tick={tickStyle as any} allowDecimals={false} />
            <YAxis dataKey="status" type="category" tick={tickStyle as any} width={80} />
            <Tooltip contentStyle={{ background: "#0A0A0F", border: "1px solid #00F5FF", fontFamily: "JetBrains Mono" }} />
            <Bar dataKey="count" animationDuration={900} label={{ fill: "#E8FBFF", fontSize: 10 }}>
              {funnel.map((f, i) => (
                <Cell key={i} fill={f.status === "Paid" ? "#39FF14" : f.status === "Confirmed" ? "#00F5FF" : f.status === "In Touch" ? "#FFB700" : "#888"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="🎁 GIFT-TO-PAID CONVERSION (8 WEEKS)" empty={gifts.length === 0}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={weekly}>
            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
            <XAxis dataKey="wk" tick={tickStyle as any} />
            <YAxis tick={tickStyle as any} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#0A0A0F", border: "1px solid #00F5FF", fontFamily: "JetBrains Mono" }} />
            <Legend wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 10 }} />
            <Bar dataKey="claims" fill="#A855F7" animationDuration={900} />
            <Bar dataKey="converted" fill="#39FF14" animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="🔥 DAILY SIGNUP HEATMAP (4 WEEKS)" empty={empty}>
        <div className="grid grid-cols-8 gap-1 text-[10px] text-[#00F5FF]/70">
          <div></div>
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i} className="text-center">{d}</div>)}
          {heatmap.cells.map((row, wi) => (
            <Fragment key={wi}>
              <div className="text-right pr-1">W{wi + 1}</div>
              {row.map((v, di) => {
                const intensity = v / heatmap.max;
                const bg = v === 0 ? "rgba(255,255,255,0.04)" : `rgba(0,245,255,${0.15 + intensity * 0.7})`;
                return <div key={di} title={`${v} signups`} className="aspect-square rounded" style={{ background: bg, boxShadow: v ? `0 0 8px rgba(0,245,255,${intensity * 0.6})` : "none" }} />;
              })}
            </Fragment>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="💰 REVENUE PIPELINE" empty={empty}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={revenue}>
            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={tickStyle as any} />
            <YAxis tick={tickStyle as any} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: "#0A0A0F", border: "1px solid #00F5FF", fontFamily: "JetBrains Mono" }} formatter={(v: any) => fmtBDT(Number(v))} />
            <Bar dataKey="value" animationDuration={900} label={{ fill: "#E8FBFF", fontSize: 10, formatter: (v: any) => fmtBDT(Number(v)) }}>
              {revenue.map((r, i) => <Cell key={i} fill={r.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children, empty }: { title: string; children: React.ReactNode; empty?: boolean }) {
  return (
    <div className="cmd-glass rounded-lg p-4 cmd-fadein">
      <h3 className="text-xs uppercase tracking-widest text-[#00F5FF] font-bold mb-3">{title}</h3>
      {empty ? (
        <div className="h-[240px] flex items-center justify-center text-[#00F5FF]/50 text-xs uppercase tracking-widest">NO DATA YET<span className="cmd-cursor">_</span></div>
      ) : children}
    </div>
  );
}

/* ───────── GROWTH TOOLS ───────── */
function FollowUpQueue({ rows }: { rows: Enrollment[] }) {
  const list = useMemo(() => rows
    .filter(r => r.status === "In Touch" && (Date.now() - +new Date(r.created_at)) > 3 * 86400000)
    .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at)),
    [rows]);

  return (
    <div className="cmd-glass rounded-lg overflow-hidden">
      <div className="px-4 py-2 border-b border-[#FF3B3B]/30 text-[#FF3B3B] uppercase tracking-widest text-xs font-bold">🔴 NEEDS FOLLOW UP ({list.length})</div>
      {list.length === 0 ? <div className="p-4 text-center text-[#00F5FF]/50 text-xs uppercase">All caught up</div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#FF3B3B]/5 text-[#FF3B3B] uppercase">
              <tr>{["Name", "Mobile", "Days Since"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
            </thead>
            <tbody>
              {list.map(r => {
                const days = Math.floor((Date.now() - +new Date(r.created_at)) / 86400000);
                return (
                  <tr key={r.id} className="border-t border-[#00F5FF]/10">
                    <td className="px-3 py-2 font-bold">{r.name}</td>
                    <td className="px-3 py-2 font-mono">
                      {r.mobile}{" "}
                      <a href={waLink(r.mobile)} target="_blank" rel="noreferrer" className="ml-1 inline-flex p-1 rounded bg-[#39FF14]/10 text-[#39FF14]"><MessageCircle className="h-3 w-3" /></a>
                    </td>
                    <td className="px-3 py-2 font-bold text-[#FFB700]">{days}d</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TodaysLeads({ rows }: { rows: Enrollment[] }) {
  const [, force] = useState(0);
  useEffect(() => { const i = setInterval(() => force(x => x + 1), 60_000); return () => clearInterval(i); }, []);
  const today = useMemo(() => {
    const now = new Date();
    const bd = new Date(now.getTime() + (6 * 60 + now.getTimezoneOffset()) * 60000);
    const ymd = `${bd.getFullYear()}-${String(bd.getMonth() + 1).padStart(2, "0")}-${String(bd.getDate()).padStart(2, "0")}`;
    return rows.filter(r => {
      const d = new Date(r.created_at);
      const bdR = new Date(d.getTime() + (6 * 60 + d.getTimezoneOffset()) * 60000);
      const k = `${bdR.getFullYear()}-${String(bdR.getMonth() + 1).padStart(2, "0")}-${String(bdR.getDate()).padStart(2, "0")}`;
      return k === ymd;
    });
  }, [rows]);

  return (
    <div className="cmd-glass rounded-lg overflow-hidden">
      <div className="px-4 py-2 border-b border-[#39FF14]/30 text-[#39FF14] uppercase tracking-widest text-xs font-bold">🟢 TODAY'S SIGNUPS ({today.length})</div>
      {today.length === 0 ? <div className="p-4 text-center text-[#00F5FF]/50 text-xs uppercase">No signups today yet</div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#39FF14]/5 text-[#39FF14] uppercase">
              <tr>{["Name", "Course", "Mobile", "Time"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
            </thead>
            <tbody>
              {today.map(r => {
                const c = inferCourse(r);
                return (
                  <tr key={r.id} className="border-t border-[#00F5FF]/10">
                    <td className="px-3 py-2 font-bold">{r.name}</td>
                    <td className="px-3 py-2">{c || r.tier || "—"}</td>
                    <td className="px-3 py-2 font-mono">{r.mobile}</td>
                    <td className="px-3 py-2 text-[10px] text-[#00F5FF]/70">{fmtDate(r.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RevenueEstimator({ rows }: { rows: Enrollment[] }) {
  const sumBy = (fn: (r: Enrollment) => boolean) => rows.filter(fn).reduce((s, r) => {
    const c = inferCourse(r); return s + (c ? COURSE_PRICE[c] : 0);
  }, 0);
  const collected = sumBy(r => r.status === "Paid");
  const confirmed = sumBy(r => r.status === "Confirmed");
  const potential = sumBy(() => true);
  return (
    <div className="cmd-glass rounded-lg p-4">
      <div className="text-xs uppercase tracking-widest text-[#00F5FF] font-bold mb-3">💰 REVENUE ESTIMATOR</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Pill color="#39FF14" label="💚 Collected" value={fmtBDT(collected)} />
        <Pill color="#00F5FF" label="🔵 Confirmed" value={fmtBDT(confirmed)} />
        <Pill color="#888" label="⚪ Potential" value={fmtBDT(potential)} />
      </div>
    </div>
  );
}

function Pill({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="rounded-lg p-3" style={{ border: `1px solid ${color}66`, background: `${color}10`, boxShadow: `0 0 16px ${color}33` }}>
      <div className="text-[10px] uppercase tracking-widest" style={{ color }}>{label}</div>
      <div className="mt-1 text-xl font-bold font-mono" style={{ color, textShadow: `0 0 12px ${color}` }}>{value}</div>
    </div>
  );
}

/* ───────── SHARED ───────── */
function StatTile({ label, value, color, loading }: { label: string; value: number | string; color: "cyan" | "amber" | "red" | "green" | "purple"; loading: boolean }) {
  const c = color === "red" ? "#FF3B3B" : color === "amber" ? "#FFB700" : color === "green" ? "#39FF14" : color === "purple" ? "#A855F7" : "#00F5FF";
  const glow = color === "red" ? "cmd-glow-red" : color === "amber" ? "cmd-glow-amber" : color === "green" ? "cmd-glow-green" : color === "purple" ? "cmd-glow-purple" : "cmd-glow-cyan";
  return (
    <div className={`cmd-glass rounded-lg p-4 md:p-5 cmd-pulse ${glow}`} style={{ borderColor: `${c}80` }}>
      <p className="text-[10px] uppercase tracking-widest" style={{ color: c, opacity: 0.85 }}>{label}</p>
      <div className="mt-2 text-2xl md:text-3xl font-bold font-mono" style={{ color: c, textShadow: `0 0 18px ${c}` }}>
        {loading ? <span className="inline-block w-16 h-8 rounded cmd-skeleton" /> : value}
      </div>
    </div>
  );
}

function StatusSelect({ value, onChange }: { value: Enrollment["status"]; onChange: (s: Enrollment["status"]) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as Enrollment["status"])} className="cmd-input rounded px-2 py-1 text-[11px] uppercase tracking-wider">
      {STATUSES.map(s => <option key={s} value={s} className="bg-[#0A0A0F]">{s}</option>)}
    </select>
  );
}

function NotesField({ value, onSave }: { value: string | null; onSave: (n: string) => void }) {
  const [v, setV] = useState(value ?? "");
  const init = useRef(value ?? "");
  useEffect(() => { setV(value ?? ""); init.current = value ?? ""; }, [value]);
  return (
    <input value={v} onChange={(e) => setV(e.target.value)} onBlur={() => { if (v !== init.current) onSave(v); }}
      placeholder="Add note…" className="cmd-input rounded px-2 py-1 text-xs w-full" />
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

// Suppress unused-import warnings for icons used only in some states
void TrendingUp; void BarChart3;
