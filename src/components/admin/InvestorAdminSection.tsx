import { useEffect, useMemo, useState } from "react";
import { Activity, Download, FileDown, Search, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { generateNdaPdf } from "@/lib/generateNdaPdf";
import { AdminCard, AdminCardHeader, AdminStatBox, adminInputCls } from "@/components/admin/adminUi";

interface InvestorSubmission {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
  investment_range: string;
  investment_timeline: string;
  area_of_interest: string;
  linkedin_profile: string | null;
  additional_notes: string | null;
  created_at: string;
}

const InvestorAdminSection = () => {
  const [submissions, setSubmissions] = useState<InvestorSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("investor_submissions").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load investor submissions");
      setSubmissions([]);
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return submissions;
    const q = search.toLowerCase();
    return submissions.filter(
      (s) =>
        s.full_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.company || "").toLowerCase().includes(q) ||
        s.area_of_interest.toLowerCase().includes(q)
    );
  }, [submissions, search]);

  const latest = submissions[0];

  const exportCsv = () => {
    if (!filtered.length) {
      toast.error("No submissions to export");
      return;
    }
    const headers = ["Name", "Email", "Company", "Range", "Timeline", "Interest", "LinkedIn", "Notes", "Submitted"];
    const rows = filtered.map((s) => [
      s.full_name,
      s.email,
      s.company || "",
      s.investment_range,
      s.investment_timeline,
      s.area_of_interest,
      s.linkedin_profile || "",
      s.additional_notes || "",
      s.created_at,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `arxon-investors-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Investor list exported");
  };

  return (
    <div className="space-y-5">
      <AdminCard>
        <AdminCardHeader
          icon={Users}
          title="Investor Submissions"
          subtitle={`${submissions.length} pre-seed inquiries`}
          action={
            <button
              onClick={generateNdaPdf}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.07]"
            >
              <FileDown size={13} /> NDA
            </button>
          }
        />

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-white/[0.06]">
          <AdminStatBox label="TOTAL SUBMISSIONS" value={submissions.length} />
          <AdminStatBox
            label="LATEST INQUIRY"
            value={latest ? latest.full_name : "—"}
            color="text-[#7c93c3]"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-white/[0.06]">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
            <input
              className={`${adminInputCls} pl-10`}
              placeholder="Search name, email, company, interest..."
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
            <table className="w-full min-w-[960px] text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-left text-[11px] uppercase tracking-wide text-white/40">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Range</th>
                  <th className="px-4 py-3">Timeline</th>
                  <th className="px-4 py-3">Interest</th>
                  <th className="px-4 py-3">LinkedIn</th>
                  <th className="px-4 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-14 text-center text-white/35">
                      {submissions.length ? "No matches for your search" : "No investor submissions yet"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] align-top">
                      <td className="px-4 py-3.5 font-semibold text-white">{s.full_name}</td>
                      <td className="px-4 py-3.5 text-white/70">{s.email}</td>
                      <td className="px-4 py-3.5 text-white/60">{s.company || "—"}</td>
                      <td className="px-4 py-3.5 text-white/70">{s.investment_range}</td>
                      <td className="px-4 py-3.5 text-white/70">{s.investment_timeline}</td>
                      <td className="px-4 py-3.5 text-white/70">{s.area_of_interest}</td>
                      <td className="px-4 py-3.5">
                        {s.linkedin_profile ? (
                          <a href={s.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-[#7c93c3] hover:underline">
                            View
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-white/50">{new Date(s.created_at).toLocaleDateString()}</td>
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

export default InvestorAdminSection;
