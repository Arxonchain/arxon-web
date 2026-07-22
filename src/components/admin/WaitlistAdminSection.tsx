import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Activity, Download, Search, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AdminCard, AdminCardHeader, AdminStatBox, adminInputCls } from "@/components/admin/adminUi";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

const WaitlistAdminSection = () => {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("waitlist").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load waitlist entries");
      setEntries([]);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter((e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q));
  }, [entries, search]);

  const last7Days = entries.filter((e) => {
    const d = parseISO(e.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  }).length;

  const chartData = useMemo(() => {
    const signupsByDate = entries.reduce((acc, entry) => {
      const date = format(parseISO(entry.created_at), "yyyy-MM-dd");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(signupsByDate)
      .map(([date, count]) => ({ date, signups: count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14)
      .map(({ date, signups }) => ({ date: format(parseISO(date), "MMM d"), signups }));
  }, [entries]);

  const exportCsv = () => {
    if (!filtered.length) {
      toast.error("No entries to export");
      return;
    }
    const rows = [["Name", "Email", "Signed Up"], ...filtered.map((e) => [e.name, e.email, e.created_at])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `arxon-waitlist-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Waitlist exported");
  };

  return (
    <div className="space-y-5">
      <AdminCard>
        <AdminCardHeader icon={Users} title="Mining Waitlist" subtitle={`${entries.length} total signups`} />
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-white/[0.06]">
          <AdminStatBox label="TOTAL SIGNUPS" value={entries.length} />
          <AdminStatBox
            label="LATEST SIGNUP"
            value={entries.length ? format(new Date(entries[0].created_at), "MMM d, yyyy") : "—"}
          />
          <AdminStatBox label="LAST 7 DAYS" value={`+${last7Days}`} color="text-[#7c93c3]" />
        </div>

        {entries.length > 0 && (
          <div className="p-4 border-b border-white/[0.06]">
            <p className="font-mono text-[9px] text-white/35 uppercase tracking-widest mb-3">14-day signup trend</p>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="waitlistGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c93c3" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#7c93c3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}
                    labelStyle={{ color: "#a1a1aa" }}
                  />
                  <Area type="monotone" dataKey="signups" stroke="#7c93c3" fill="url(#waitlistGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-white/[0.06]">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
            <input
              className={`${adminInputCls} pl-10`}
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={exportCsv}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#7c93c3]/10 text-[#7c93c3] border border-[#7c93c3]/20 text-sm font-semibold hover:bg-[#7c93c3]/20"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Activity size={22} className="text-[#7c93c3] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-left text-[11px] uppercase tracking-wide text-white/40">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Signed Up</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-14 text-center text-white/35">
                      {entries.length ? "No matches for your search" : "No waitlist entries yet"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((entry) => (
                    <tr key={entry.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3.5 font-semibold text-white">{entry.name}</td>
                      <td className="px-4 py-3.5 text-white/70">{entry.email}</td>
                      <td className="px-4 py-3.5 text-white/50">{format(new Date(entry.created_at), "MMM d, yyyy h:mm a")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
};

export default WaitlistAdminSection;
