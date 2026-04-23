import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Users, TrendingUp, FileDown } from "lucide-react";
import { generateNdaPdf } from "@/lib/generateNdaPdf";
import { useToast } from "@/hooks/use-toast";

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

export default function InvestorAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<InvestorSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      setUser(user);

      const { data: roleData, error: roleError } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });

      if (roleError) throw roleError;

      if (!roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchSubmissions();
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/");
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("investor_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: "Failed to load investor submissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const latestSubmission = submissions[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Investor Submissions</h1>
            <p className="text-muted-foreground">
              Manage and review pre-seed investor inquiries
            </p>
          </div>
          <Button onClick={generateNdaPdf} variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Download NDA
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
              <p className="text-xs text-muted-foreground">
                Total investor inquiries received
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Submission</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestSubmission
                  ? new Date(latestSubmission.created_at).toLocaleDateString()
                  : "No submissions"}
              </div>
              <p className="text-xs text-muted-foreground">
                {latestSubmission ? latestSubmission.full_name : "Waiting for first submission"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>
              Complete list of investor inquiries with details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No investor submissions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Investment Range</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Interest Area</TableHead>
                      <TableHead>LinkedIn</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.full_name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.company || "-"}</TableCell>
                        <TableCell>{submission.investment_range}</TableCell>
                        <TableCell>{submission.investment_timeline}</TableCell>
                        <TableCell>{submission.area_of_interest}</TableCell>
                        <TableCell>
                          {submission.linkedin_profile ? (
                            <a
                              href={submission.linkedin_profile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(submission.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Modes Table */}
        <Card className="mt-8 border-[#7D93C4]/20 bg-[hsl(220,20%,5%)]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold" style={{ fontFamily: 'Creato Display, sans-serif' }}>
              <span className="text-[#7D93C4]">Arxon</span> Privacy Modes
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Configurable privacy layers for every transaction type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-[#7D93C4]/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#7D93C4]/10 border-b border-[#7D93C4]/15">
                    <th className="px-5 py-4 text-left font-semibold text-[#7D93C4] tracking-wide">Privacy Mode</th>
                    <th className="px-5 py-4 text-center font-semibold text-[#7D93C4] tracking-wide">Sender Hidden?</th>
                    <th className="px-5 py-4 text-center font-semibold text-[#7D93C4] tracking-wide">Receiver Hidden?</th>
                    <th className="px-5 py-4 text-center font-semibold text-[#7D93C4] tracking-wide">Amount Hidden?</th>
                    <th className="px-5 py-4 text-left font-semibold text-[#7D93C4] tracking-wide">Real Use Case Example</th>
                    <th className="px-5 py-4 text-left font-semibold text-[#7D93C4] tracking-wide">Compliance Fit</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { mode: "All Public", sender: false, receiver: false, amount: false, useCase: "Auditable business / KYC transfer", compliance: "Full audit possible" },
                    { mode: "Hide Amount Only", sender: false, receiver: false, amount: true, useCase: "Remittance to family (they know it's you, boss can't see amount)", compliance: "Parties traceable" },
                    { mode: "Hide Sender + Amount", sender: true, receiver: false, amount: true, useCase: "Anonymous donation to known receiver", compliance: "Receiver auditable" },
                    { mode: "Hide Everything", sender: true, receiver: true, amount: true, useCase: "Coercion-resistant voting ballot", compliance: "Zero visibility" },
                    { mode: "Hide Receiver + Amount", sender: false, receiver: true, amount: true, useCase: "Paying a service privately (sender auditable)", compliance: "Sender traceable" },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-[#7D93C4]/8 ${i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'} hover:bg-[#7D93C4]/5 transition-colors`}>
                      <td className="px-5 py-4 font-medium text-foreground whitespace-nowrap">{row.mode}</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${row.sender ? 'bg-[#7D93C4]/20 text-[#7D93C4]' : 'bg-red-500/10 text-red-400'}`}>
                          {row.sender ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${row.receiver ? 'bg-[#7D93C4]/20 text-[#7D93C4]' : 'bg-red-500/10 text-red-400'}`}>
                          {row.receiver ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${row.amount ? 'bg-[#7D93C4]/20 text-[#7D93C4]' : 'bg-red-500/10 text-red-400'}`}>
                          {row.amount ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-foreground/90 max-w-[220px]">{row.useCase}</td>
                      <td className="px-5 py-4 text-foreground/90 whitespace-nowrap">{row.compliance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
