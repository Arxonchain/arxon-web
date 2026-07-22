import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Users, TrendingUp, FileDown } from "lucide-react";
import { generateNdaPdf } from "@/lib/generateNdaPdf";
import { verifyApprovedAdminAccess } from "@/lib/adminAccess";
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
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/admin?section=overview";
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

      const access = await verifyApprovedAdminAccess(user.id);
      if (!access.allowed) {
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: access.reason ?? "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      setIsAdmin(true);
      fetchSubmissions();
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/auth");
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
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="container mx-auto p-6 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate(returnTo)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin
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

      </div>
    </div>
  );
}
