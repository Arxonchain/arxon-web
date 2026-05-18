import jsPDF from "jspdf";
import arxonLogo from "@/assets/arxon-logo-header.png";

export function generateNdaPdf() {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const marginL = 22;
  const marginR = 22;
  const contentW = pageW - marginL - marginR;
  let y = 0;

  const addPage = () => {
    doc.addPage();
    y = 25;
  };

  const checkPage = (needed: number) => {
    if (y + needed > 275) addPage();
  };

  // ── helpers ──
  const heading = (text: string, size = 13) => {
    checkPage(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(20, 20, 20);
    doc.text(text, marginL, y);
    y += size * 0.5 + 4;
  };

  const sectionNum = (num: string, title: string) => {
    checkPage(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text(`${num}. ${title}`, marginL, y);
    y += 7;
  };

  const body = (text: string, indent = 0) => {
    checkPage(10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(text, contentW - indent);
    for (const line of lines) {
      checkPage(5);
      doc.text(line, marginL + indent, y);
      y += 4.5;
    }
    y += 2;
  };

  const bullet = (label: string, text: string, indent = 6) => {
    checkPage(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    const full = `${label} ${text}`;
    const lines = doc.splitTextToSize(full, contentW - indent);
    for (const line of lines) {
      checkPage(5);
      doc.text(line, marginL + indent, y);
      y += 4.5;
    }
    y += 1;
  };

  // ══════════════════════════════════════════
  // PAGE 1 – HEADER BANNER
  // ══════════════════════════════════════════

  // Dark banner
  doc.setFillColor(8, 10, 18);
  doc.rect(0, 0, pageW, 44, "F");

  // Accent line
  doc.setFillColor(0, 200, 150);
  doc.rect(0, 44, pageW, 1.2, "F");

  // Logo
  try {
    doc.addImage(arxonLogo, "PNG", marginL, 12, 50, 16);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(200, 210, 208);
    doc.text("ARXON", marginL + 4, 26);
  }

  // Title on banner
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("NON-DISCLOSURE AGREEMENT", pageW - marginR, 22, { align: "right" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 175, 172);
  doc.text("One-Way NDA  |  Confidential", pageW - marginR, 29, { align: "right" });

  y = 54;

  // ── Intro ──
  body(
    'This Non-Disclosure Agreement (the "Agreement") is entered into on [Insert Date, e.g., March 10, 2026] (the "Effective Date"), by and between:'
  );

  y += 2;
  heading("Disclosing Party", 11);
  body(
    "Gabe Ademibo, Founder of Arxon Blockchain, residing in Nigeria, with contact email gabemetax@gmail.com."
  );

  heading("Receiving Party", 11);
  body(
    "Zeoraex Ronish, an individual residing in Nepal."
  );

  // ── Recitals ──
  y += 2;
  heading("Recitals", 12);
  body(
    "WHEREAS, the Disclosing Party owns certain confidential and proprietary information related to the Arxon mining application accessible at arxonchain.xyz, including but not limited to source code, architecture, APIs, configurations, and related materials generated using Lovable.dev (collectively, the \"Project\");"
  );
  body(
    "WHEREAS, the Disclosing Party wishes to disclose certain Confidential Information (as defined below) to the Receiving Party solely for the purpose of evaluating the feasibility of integrating the Project into a mobile application, providing advice, and potentially assisting with such integration (the \"Purpose\");"
  );
  body(
    "WHEREAS, the Receiving Party agrees to receive and protect such Confidential Information under the terms of this Agreement."
  );
  body(
    "NOW, THEREFORE, in consideration of the mutual promises herein and the disclosure of Confidential Information, the parties agree as follows:"
  );

  // ── Section 1 ──
  y += 2;
  sectionNum("1", "Definition of Confidential Information");
  body(
    '"Confidential Information" means all non-public information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, electronically, or by inspection, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. This includes, without limitation:'
  );
  bullet("•", "Source code, scripts, components, and generated code (React/TypeScript frontend, Supabase backend, or similar);");
  bullet("•", "API endpoints, keys (if any remain after redaction), authentication mechanisms, database schemas, and integrations;");
  bullet("•", "Mining logic, reward systems, referral mechanics, user authentication, data structures, algorithms, and business processes;");
  bullet("•", "Technical designs, prototypes, documentation, and any notes, analyses, or derivatives created from the above.");

  // ── Section 2 ──
  y += 2;
  sectionNum("2", "Exclusions from Confidential Information");
  body("Confidential Information does not include information that:");
  bullet("(a)", "Is or becomes publicly available through no fault of the Receiving Party;");
  bullet("(b)", "Was already known to the Receiving Party prior to disclosure, as evidenced by written records;");
  bullet("(c)", "Is independently developed by the Receiving Party without use of or reference to the Disclosing Party's Confidential Information;");
  bullet("(d)", "Is lawfully received from a third party without restriction on disclosure.");

  // ── Section 3 ──
  y += 2;
  sectionNum("3", "Obligations of the Receiving Party");
  body("The Receiving Party agrees to:");
  bullet("(a)", "Hold all Confidential Information in strict confidence and not disclose it to any third party without the prior written consent of the Disclosing Party;");
  bullet("(b)", "Use the Confidential Information solely for the Purpose and not for any other purpose, including personal gain, competition, or reverse engineering;");
  bullet("(c)", "Limit access to Confidential Information to only those employees, contractors, or advisors who have a need to know for the Purpose and who are bound by confidentiality obligations at least as protective as those herein;");
  bullet("(d)", "Not copy, reproduce, modify, or create derivative works from the Confidential Information except as strictly necessary for the Purpose;");
  bullet("(e)", "Upon the Disclosing Party's request, or upon termination of discussions related to the Purpose, promptly return or destroy all Confidential Information (including copies, notes, and derivatives) and certify in writing that such return or destruction has been completed.");

  // ── Section 4 ──
  y += 2;
  sectionNum("4", "No License or Rights Granted");
  body(
    "Nothing in this Agreement grants the Receiving Party any right, title, license, or interest in or to the Confidential Information or any intellectual property rights therein. All rights remain exclusively with the Disclosing Party."
  );

  // ── Section 5 ──
  y += 2;
  sectionNum("5", "Term");
  body(
    "The obligations of confidentiality under this Agreement shall continue for a period of three (3) years from the Effective Date, or until the Confidential Information no longer qualifies as a trade secret under applicable law, whichever is longer. The obligations to return/destroy Confidential Information survive termination."
  );

  // ── Section 6 ──
  y += 2;
  sectionNum("6", "Remedies");
  body(
    "The Receiving Party acknowledges that any unauthorized disclosure or use of Confidential Information may cause irreparable harm to the Disclosing Party, for which monetary damages may be inadequate. Accordingly, the Disclosing Party shall be entitled to seek injunctive relief, in addition to any other remedies available at law or in equity."
  );

  // ── Section 7 ──
  y += 2;
  sectionNum("7", "Governing Law and Dispute Resolution");
  body(
    "This Agreement shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to conflict of laws principles. Any disputes arising out of or in connection with this Agreement shall be resolved exclusively in the courts located in Nigeria."
  );

  // ── Section 8 ──
  y += 2;
  sectionNum("8", "Entire Agreement");
  body(
    "This Agreement constitutes the entire understanding between the parties with respect to the subject matter hereof and supersedes all prior agreements. Any amendments must be in writing and signed by both parties."
  );

  // ── Section 9 ──
  y += 2;
  sectionNum("9", "Execution");
  body(
    "This Agreement may be executed in counterparts, including electronically, each of which shall be deemed an original."
  );

  // ── Signature block ──
  y += 4;
  checkPage(60);

  // Divider
  doc.setDrawColor(0, 200, 150);
  doc.setLineWidth(0.5);
  doc.line(marginL, y, pageW - marginR, y);
  y += 8;

  heading("IN WITNESS WHEREOF", 11);
  body("The parties have executed this Agreement as of the Effective Date.");
  y += 6;

  // Disclosing Party signature
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text("Disclosing Party", marginL, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(40, 40, 40);
  doc.text("Signature: _______________________________", marginL, y);
  y += 6;
  doc.text("Name: Gabe Ademibo (Founder of Arxon)", marginL, y);
  y += 6;
  doc.text("Date: 07-03-2026", marginL, y);
  y += 14;

  // Receiving Party signature
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text("Receiving Party", marginL, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(40, 40, 40);
  doc.text("Signature: _______________________________", marginL, y);
  y += 6;
  doc.text("Name: Zeoraex Ronish", marginL, y);
  y += 6;
  doc.text("Date: _______________________________", marginL, y);

  // ── Footer on every page ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(140, 140, 140);
    doc.text("Arxon Blockchain  •  Confidential  •  arxonchain.xyz", pageW / 2, 290, { align: "center" });
    doc.text(`Page ${i} of ${totalPages}`, pageW - marginR, 290, { align: "right" });
  }

  doc.save("Arxon_NDA_Zeoraex_Ronish.pdf");
}
