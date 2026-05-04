import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminSignOut, useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubmissionsTable, type Column } from "@/components/admin/SubmissionsTable";
import { Loader2, LogOut, RefreshCw, Gift, Rocket } from "lucide-react";
import { toast } from "sonner";

type GiftClaim = {
  id: string;
  full_name: string;
  whatsapp_number: string;
  created_at: string;
};

type Lead = {
  id: string;
  full_name: string;
  school_name: string | null;
  ssc_roll: string;
  mobile_number: string;
  batch: string | null;
  discount_code: string | null;
  created_at: string;
};

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const fmt = (iso: string) => new Date(iso).toLocaleString();
const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();
const isThisWeek = (iso: string) => {
  const d = new Date(iso).getTime();
  return Date.now() - d < 7 * 24 * 60 * 60 * 1000;
};

function AdminDashboard() {
  const nav = useNavigate();
  const { loading, userId, isAdmin, email } = useAdminAuth();
  const [claims, setClaims] = useState<GiftClaim[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && (!userId || !isAdmin)) {
      nav({ to: "/admin/login" });
    }
  }, [loading, userId, isAdmin, nav]);

  const load = useCallback(async () => {
    setRefreshing(true);
    const [c, l] = await Promise.all([
      supabase.from("gift_claims").select("*").order("created_at", { ascending: false }),
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
    ]);
    if (c.error) toast.error("Failed to load gift claims");
    else setClaims(c.data ?? []);
    if (l.error) toast.error("Failed to load enrollments");
    else setLeads(l.data ?? []);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [isAdmin, load]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const claimsToday = claims.filter((r) => isToday(r.created_at)).length;
  const leadsToday = leads.filter((r) => isToday(r.created_at)).length;
  const claimsWeek = claims.filter((r) => isThisWeek(r.created_at)).length;
  const leadsWeek = leads.filter((r) => isThisWeek(r.created_at)).length;

  const claimColumns: Column<GiftClaim>[] = [
    { key: "full_name", label: "Name" },
    {
      key: "whatsapp_number",
      label: "WhatsApp",
      render: (r) => (
        <a
          className="text-primary hover:underline"
          href={`https://wa.me/${r.whatsapp_number.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noreferrer"
        >
          {r.whatsapp_number}
        </a>
      ),
    },
    { key: "created_at", label: "Submitted", render: (r) => fmt(r.created_at) },
  ];

  const leadColumns: Column<Lead>[] = [
    { key: "full_name", label: "Name" },
    { key: "school_name", label: "School" },
    { key: "ssc_roll", label: "SSC Roll" },
    {
      key: "mobile_number",
      label: "Mobile",
      render: (r) => (
        <a className="text-primary hover:underline" href={`tel:${r.mobile_number}`}>
          {r.mobile_number}
        </a>
      ),
    },
    { key: "batch", label: "Batch" },
    { key: "discount_code", label: "Discount" },
    { key: "created_at", label: "Submitted", render: (r) => fmt(r.created_at) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await adminSignOut();
                nav({ to: "/admin/login" });
              }}
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Gift Claims" value={claims.length} icon={<Gift className="h-4 w-4" />} />
          <StatCard label="Total Enrollments" value={leads.length} icon={<Rocket className="h-4 w-4" />} />
          <StatCard label="Today" value={claimsToday + leadsToday} sub={`${claimsToday} gifts · ${leadsToday} enroll`} />
          <StatCard label="This Week" value={claimsWeek + leadsWeek} sub={`${claimsWeek} gifts · ${leadsWeek} enroll`} />
        </div>

        <Tabs defaultValue="leads">
          <TabsList>
            <TabsTrigger value="leads">
              <Rocket className="h-4 w-4 mr-2" /> Enrollments ({leads.length})
            </TabsTrigger>
            <TabsTrigger value="claims">
              <Gift className="h-4 w-4 mr-2" /> Gift Claims ({claims.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="leads" className="mt-4">
            <SubmissionsTable
              rows={leads}
              columns={leadColumns}
              searchKeys={["full_name", "mobile_number", "ssc_roll", "school_name", "batch", "discount_code"]}
              filename="enrollments"
            />
          </TabsContent>
          <TabsContent value="claims" className="mt-4">
            <SubmissionsTable
              rows={claims}
              columns={claimColumns}
              searchKeys={["full_name", "whatsapp_number"]}
              filename="gift-claims"
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: number;
  sub?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}
