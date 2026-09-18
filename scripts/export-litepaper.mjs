/**
 * One-off litepaper export — reads structured content and writes MD, DOCX, PDF.
 * Run: node scripts/export-litepaper.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  PageBreak,
} from "docx";
import { jsPDF } from "jspdf";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "exports");

const META = {
  badge: "LITEPAPER_2026 · INFORMATIONAL_ONLY",
  documentTitle: "Arxon Litepaper",
  coverTitle: "Sovereign Privacy Blockchain",
  coverSubtitle: "for the Unbanked World",
};

/** Plain-text litepaper content (mirrors litepaperContent.ts, without UI icons). */
const CHAPTERS = [
  {
    number: 1,
    slug: "introduction",
    isCover: true,
    title: "Sovereign Privacy Blockchain",
    subtitle: "for the Unbanked World",
    blocks: [
      {
        type: "quote",
        text: "Financial sovereignty is not a privilege. It is a right.",
      },
      {
        type: "paragraph",
        text: "This litepaper outlines Arxon's mission, the technology we have shipped, and what comes next. Arxon is a sovereign Layer 1 blockchain built for financial privacy and access, designed first for the unbanked and underbanked populations of Africa, Asia, and Latin America.",
      },
      {
        type: "paragraph",
        text: "Bitcoin proved money without banks was possible. Ethereum proved programmable money was possible. Arxon is building the next step: private, accessible, fair money for the people who need it most.",
      },
      {
        type: "paragraph",
        text: "Use the chapter navigation to read at your own pace. Each section covers a distinct part of the Arxon story, from the problem we solve to the roadmap ahead.",
      },
    ],
  },
  {
    number: 2,
    slug: "problem",
    sectionId: "SECTION_01",
    label: "THE_PROBLEM",
    title: "The Problem",
    blocks: [
      {
        type: "paragraph",
        text: "The global financial system was not built for everyone. Despite two generations of cryptocurrency innovation, over 1.4 billion adults worldwide remain without access to basic financial services. Blockchain promised to change this. In practice, the benefits have mostly flowed to those who were already financially included.",
      },
      {
        type: "paragraph",
        text: "For hundreds of millions of people, the choice is not between crypto and traditional banking. It is between cash and nothing. Public blockchains offer an alternative, but they introduce a different kind of exposure: every balance, every payment, and every counterparty is permanently visible on a public ledger.",
      },
      {
        type: "problem-cards",
        items: [
          {
            id: "P-001",
            title: "Financial Exclusion",
            desc: "Hundreds of millions in Africa, Asia, and Latin America conduct their entire financial lives in cash. Without bank accounts, they cannot save securely, access credit, or participate in the digital economy.",
          },
          {
            id: "P-002",
            title: "Financial Surveillance",
            desc: "Public blockchains solve financial exclusion but introduce total transparency. Your wallet balance, every transaction, and every person you've ever paid is permanently visible to anyone on earth.",
          },
          {
            id: "P-003",
            title: "The Cost of Sending Money Home",
            desc: "The Nigerian diaspora alone sends over $20 billion home yearly. At current fees of 6% to 8%, over $1.5 billion is extracted from the world's poorest families every single year.",
          },
          {
            id: "P-004",
            title: "The Compliance Cost of Total Privacy",
            desc: "Privacy first chains built on absolute anonymity create a structural conflict with regulators and exchanges. Total opacity is treated as unacceptable risk, leading to delistings, closed gateways, and legitimate users locked out. Arxon rejects the all or nothing model. With privacy by choice, each transaction sets four independent flags for sender, recipient, amount, and balance in any combination across eight privacy modes. Stay private by default, prove compliance when required, and keep the network usable in the real world.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "These are not abstract market failures. They are daily realities for families sending remittances, workers paid in cash, and communities locked out of credit. A blockchain built for the unbanked world must address exclusion and surveillance together, not trade one for the other or sacrifice access to privacy maximalism.",
      },
    ],
  },
  {
    number: 3,
    slug: "built",
    sectionId: "SECTION_02",
    label: "WHAT_WE_BUILT",
    title: "What We've Already Built",
    blocks: [
      {
        type: "paragraph",
        text: "Arxon is not a whitepaper promise. The core network is live in a multi node testnet, with real miners, real transactions, and real privacy controls already in operation. Everything listed here exists today.",
      },
      {
        type: "built-list",
        items: [
          {
            id: "B-001",
            title: "A Live Sovereign Blockchain",
            desc: "Running AURA + GRANDPA consensus with a new block every six seconds in multi node testnet configuration.",
          },
          {
            id: "B-002",
            title: "Unique Chain ID & ARX Token",
            desc: "Fixed supply with its own unique identity, no inflation.",
          },
          {
            id: "B-003",
            title: "Full Ethereum Compatibility",
            desc: "Any smart contract written for Ethereum deploys on Arxon without changes. MetaMask connects out of the box.",
          },
          {
            id: "B-004",
            title: "Selective Privacy System",
            desc: "Four independent privacy flags working in any combination, eight distinct privacy modes.",
          },
          {
            id: "B-005",
            title: "Private Transaction Receipts",
            desc: "Tamper proof records with single use disclosure codes for third party verification.",
          },
          {
            id: "B-006",
            title: "ARX P Mining System",
            desc: "25k+ community of real miners earning points before mainnet, convertible to ARX tokens at launch.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "AURA + GRANDPA gives Arxon fast, deterministic finality suitable for everyday payments. EVM compatibility means developers can deploy existing Solidity contracts without rewriting tooling. The selective privacy system and private receipts are already usable on testnet, not scheduled for a distant milestone.",
      },
    ],
  },
  {
    number: 4,
    slug: "building",
    sectionId: "SECTION_03",
    label: "WHAT_WE_BUILD",
    title: "What We Are Building",
    blocks: [
      {
        type: "paragraph",
        text: "The foundation is in place. The next phase adds cryptographic guarantees that make privacy mathematically enforced rather than conventionally hidden, and opens the network to applications that require both confidentiality and verifiability.",
      },
      {
        type: "feature-cards",
        items: [
          {
            title: "Zero Knowledge Cryptographic Privacy",
            desc: "Halo2 zero knowledge proofs make hidden information impossible to reveal, even with complete access to the blockchain's raw data. Halo2 requires no trusted setup. The security is mathematical, not ceremonial.",
          },
          {
            title: "On Chain Private Voting",
            desc: "A voting system where coercion is cryptographically impossible. Voters prove eligibility without revealing identity. Results are tallied through Layer 2 ZK batch proofs. One billion votes across 10,000 batches settles on chain in seconds.",
          },
        ],
      },
      {
        type: "developer-list",
        title: "Developer Ecosystem",
        items: [
          "Privacy preserving DeFi: trading, lending with confidential amounts",
          "Private remittance applications for diaspora markets",
          "Confidential payroll systems with private salary information",
          "ZK voting applications for communities, DAOs, and governments",
          "Private NFT marketplaces and confidential identity systems",
        ],
      },
      {
        type: "paragraph",
        text: "These capabilities extend what Arxon already ships on testnet. Developers building on Arxon get Ethereum compatible tooling today, with a clear path to ZK enforced privacy and voting as those integrations reach production readiness.",
      },
    ],
  },
  {
    number: 5,
    slug: "roadmap",
    sectionId: "SECTION_04",
    label: "ROADMAP",
    title: "Roadmap",
    blocks: [
      {
        type: "paragraph",
        text: "Arxon's roadmap reflects what is already complete, what is actively in development, and what follows once the public testnet and ZK integrations are production ready. Timelines may shift as security audits and community feedback land.",
      },
      {
        type: "roadmap",
        phases: [
          {
            status: "COMPLETE",
            items: [
              "Sovereign Layer 1 blockchain in multi node testnet",
              "ARX native token with fixed supply",
              "Full EVM compatibility, MetaMask, Solidity, all Ethereum tooling",
              "Selective privacy system, four independent per transaction flags",
              "Private Transaction Receipt system with disclosure codes",
              "ARX P mining system, 25k+ community",
              "On chain ARX claim pallet for unlimited miners",
            ],
          },
          {
            status: "IN BUILDING PROCESS",
            items: [
              "Public testnet launch, anyone can connect and transact",
              "Block explorer, browse all Arxon transactions publicly",
              "Testnet faucet for developers",
              "Validator expansion",
              "Anti rug protection registry",
              "Developer documentation and SDK release",
              "MetaMask official chain registration",
              "Halo2 zero knowledge proof integration",
              "Cryptographic enforcement of all four privacy flags",
              "ZK voting Phase 1: private on chain votes",
              "Privacy preserving DeFi primitives",
              "Third party ZK circuit security audit",
            ],
          },
          {
            status: "AHEAD: ECOSYSTEM",
            items: [
              "ZK voting Phase 2, national scale batch proof elections",
              "Remittance corridor integrations for Nigeria and diaspora",
              "Mobile wallet with built in privacy controls",
              "Cross chain bridges to major ecosystems",
              "Mainnet launch with ARX P conversion",
            ],
          },
        ],
      },
    ],
  },
  {
    number: 6,
    slug: "why-arxon",
    sectionId: "SECTION_05",
    label: "WHY_ARXON",
    title: "Why Arxon",
    blocks: [
      {
        type: "paragraph",
        text: "Arxon exists because the combination of financial exclusion and financial surveillance creates a gap no existing chain adequately addresses. Most public networks optimize for traders and developers in already banked markets. Privacy maximalist chains trade surveillance for total anonymity, only to face exchange delistings and blocked onramps. Arxon optimizes for people who need privacy and access at the same time through privacy by choice.",
      },
      {
        type: "why-cards",
        items: [
          {
            title: "The problem is real and the users are real",
            desc: "Financial exclusion affects hundreds of millions right now. The diaspora paying 7% fees to send money home is real. The voter who fears coercion is real. Arxon is built for these people.",
          },
          {
            title: "The technology is original",
            desc: "Selective transaction privacy does not exist on any other production blockchain. This is not an incremental improvement. It is a new capability.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "With 25k+ active miners already participating before mainnet, Arxon also has a community that matches its mission: people earning their place on the network before launch, not speculating on a distant token event.",
      },
    ],
  },
  {
    number: 7,
    slug: "closing",
    title: "Built For the World",
    blocks: [
      {
        type: "closing",
        paragraphs: [
          "Bitcoin proved money without banks was possible. Ethereum proved programmable money was possible. Arxon is proving that private, accessible, fair money is possible, and building it for the people who need it most.",
        ],
        tagline: "Arxon is Built For the World.",
        disclaimer:
          "DISCLAIMER: This litepaper is for informational purposes only. It does not constitute financial advice or an offer of any kind. Arxon is in active development.",
      },
    ],
  },
];

function ensureOutDir() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function chapterHeading(ch) {
  if (ch.isCover) return "Introduction";
  return ch.title;
}

function buildMarkdown() {
  const lines = [];
  lines.push(`# ${META.documentTitle}`);
  lines.push("");
  lines.push(`*${META.badge}*`);
  lines.push("");
  lines.push("---");
  lines.push("");

  for (const ch of CHAPTERS) {
    if (ch.isCover) {
      lines.push(`## ${ch.number}. Introduction`);
      lines.push("");
      lines.push(`# ${ch.title}`);
      lines.push(`## ${ch.subtitle}`);
      lines.push("");
    } else {
      lines.push(`## ${String(ch.number).padStart(2, "0")}. ${ch.title}`);
      if (ch.sectionId) lines.push(`*${ch.sectionId} · ${ch.label ?? ""}*`.trim());
      lines.push("");
    }

    for (const block of ch.blocks) {
      switch (block.type) {
        case "paragraph":
          lines.push(block.text);
          lines.push("");
          break;
        case "quote":
          lines.push(`> "${block.text}"`);
          lines.push("");
          break;
        case "problem-cards":
          for (const item of block.items) {
            lines.push(`### ${item.id} — ${item.title}`);
            lines.push("");
            lines.push(item.desc);
            lines.push("");
          }
          break;
        case "built-list":
          for (const item of block.items) {
            lines.push(`- **${item.id} — ${item.title}** — ${item.desc}`);
          }
          lines.push("");
          break;
        case "feature-cards":
          for (const item of block.items) {
            lines.push(`### ${item.title}`);
            lines.push("");
            lines.push(item.desc);
            lines.push("");
          }
          break;
        case "developer-list":
          lines.push(`### ${block.title}`);
          lines.push("");
          for (const item of block.items) {
            lines.push(`- ${item}`);
          }
          lines.push("");
          break;
        case "roadmap":
          for (const phase of block.phases) {
            lines.push(`### ${phase.status}`);
            lines.push("");
            for (const item of phase.items) {
              lines.push(`- ${item}`);
            }
            lines.push("");
          }
          break;
        case "why-cards":
          for (const item of block.items) {
            lines.push(`### ${item.title}`);
            lines.push("");
            lines.push(item.desc);
            lines.push("");
          }
          break;
        case "closing":
          for (const p of block.paragraphs) {
            lines.push(p);
            lines.push("");
          }
          lines.push(`*"${block.tagline}"*`);
          lines.push("");
          lines.push(`*${block.disclaimer}*`);
          lines.push("");
          break;
        default:
          break;
      }
    }

    lines.push("---");
    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}

function bodyParagraph(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 200, line: 276 },
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: [
      new TextRun({
        text,
        size: opts.size ?? 22,
        italics: opts.italics ?? false,
        bold: opts.bold ?? false,
        color: opts.color,
      }),
    ],
  });
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 400 : 280, after: 160 },
    children: [new TextRun({ text, bold: true })],
  });
}

function bulletItem(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function cardBlock(title, body, id) {
  const runs = [];
  if (id) runs.push(new TextRun({ text: `${id} — `, bold: true, size: 22 }));
  runs.push(new TextRun({ text: title, bold: true, size: 22 }));
  return [
    new Paragraph({ spacing: { before: 180, after: 80 }, children: runs }),
    bodyParagraph(body),
  ];
}

async function buildDocx() {
  const children = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: META.badge,
          size: 18,
          color: "666666",
          font: "Courier New",
        }),
      ],
    })
  );
  children.push(
    heading(`${META.coverTitle}\n${META.coverSubtitle}`, HeadingLevel.TITLE)
  );
  children.push(new Paragraph({ children: [new PageBreak()] }));

  children.push(heading("Table of Contents", HeadingLevel.HEADING_1));
  for (const ch of CHAPTERS) {
    children.push(
      bulletItem(
        `${String(ch.number).padStart(2, "0")}. ${chapterHeading(ch)}`
      )
    );
  }
  children.push(new Paragraph({ children: [new PageBreak()] }));

  for (const ch of CHAPTERS) {
    if (ch.isCover) {
      children.push(heading("Introduction", HeadingLevel.HEADING_1));
      children.push(heading(ch.title, HeadingLevel.HEADING_2));
      children.push(heading(ch.subtitle, HeadingLevel.HEADING_3));
    } else {
      children.push(heading(ch.title, HeadingLevel.HEADING_1));
      if (ch.sectionId) {
        children.push(
          bodyParagraph(`${ch.sectionId}${ch.label ? ` · ${ch.label}` : ""}`, {
            size: 18,
            color: "666666",
          })
        );
      }
    }

    for (const block of ch.blocks) {
      switch (block.type) {
        case "paragraph":
          children.push(bodyParagraph(block.text));
          break;
        case "quote":
          children.push(
            bodyParagraph(`"${block.text}"`, { center: true, italics: true })
          );
          break;
        case "problem-cards":
          for (const item of block.items) {
            children.push(...cardBlock(item.title, item.desc, item.id));
          }
          break;
        case "built-list":
          for (const item of block.items) {
            children.push(
              bulletItem(`${item.id} — ${item.title}: ${item.desc}`)
            );
          }
          break;
        case "feature-cards":
          for (const item of block.items) {
            children.push(...cardBlock(item.title, item.desc));
          }
          break;
        case "developer-list":
          children.push(heading(block.title, HeadingLevel.HEADING_2));
          for (const item of block.items) {
            children.push(bulletItem(item));
          }
          break;
        case "roadmap":
          for (const phase of block.phases) {
            children.push(heading(phase.status, HeadingLevel.HEADING_2));
            for (const item of phase.items) {
              children.push(bulletItem(item));
            }
          }
          break;
        case "why-cards":
          for (const item of block.items) {
            children.push(...cardBlock(item.title, item.desc));
          }
          break;
        case "closing":
          for (const p of block.paragraphs) {
            children.push(bodyParagraph(p, { center: true }));
          }
          children.push(
            bodyParagraph(`"${block.tagline}"`, {
              center: true,
              bold: true,
              italics: true,
              size: 26,
            })
          );
          children.push(
            bodyParagraph(block.disclaimer, {
              center: true,
              size: 18,
              color: "666666",
            })
          );
          break;
        default:
          break;
      }
    }

    if (ch.number < CHAPTERS.length) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  }

  const doc = new Document({
    creator: "Arxon",
    title: META.documentTitle,
    description: "Arxon Litepaper 2026",
    sections: [{ properties: {}, children }],
  });

  return Packer.toBuffer(doc);
}

function wrapText(doc, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (doc.getTextWidth(test) <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function buildPdf() {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 56;
  const maxW = pageW - margin * 2;
  let y = margin;

  const ensureSpace = (needed = 20) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const writeLines = (lines, opts = {}) => {
    const lineHeight = opts.lineHeight ?? 16;
    doc.setFont("helvetica", opts.style ?? "normal");
    doc.setFontSize(opts.size ?? 11);
    doc.setTextColor(opts.color ?? "#111111");
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, opts.center ? pageW / 2 : margin, y, {
        align: opts.center ? "center" : "left",
        maxWidth: opts.center ? maxW : undefined,
      });
      y += lineHeight;
    }
  };

  const writeHeading = (text, size = 18) => {
    ensureSpace(size + 12);
    y += 8;
    writeLines([text], { size, style: "bold" });
    y += 4;
  };

  const writeParagraph = (text, opts = {}) => {
    const lines = wrapText(doc, text, maxW);
    writeLines(lines, { ...opts, lineHeight: opts.lineHeight ?? 15 });
    y += 6;
  };

  // Cover
  writeLines([META.badge], { size: 9, color: "#666666", center: true });
  y += 24;
  writeHeading(META.coverTitle, 22);
  writeHeading(META.coverSubtitle, 16);
  doc.addPage();
  y = margin;

  // TOC
  writeHeading("Table of Contents", 16);
  for (const ch of CHAPTERS) {
    writeParagraph(
      `${String(ch.number).padStart(2, "0")}. ${chapterHeading(ch)}`,
      { size: 11 }
    );
  }
  doc.addPage();
  y = margin;

  for (const ch of CHAPTERS) {
    if (ch.isCover) {
      writeHeading("Introduction", 16);
      writeHeading(ch.title, 14);
      writeHeading(ch.subtitle, 12);
    } else {
      writeHeading(ch.title, 16);
      if (ch.sectionId) {
        writeParagraph(
          `${ch.sectionId}${ch.label ? ` · ${ch.label}` : ""}`,
          { size: 9, color: "#666666" }
        );
      }
    }

    for (const block of ch.blocks) {
      switch (block.type) {
        case "paragraph":
          writeParagraph(block.text);
          break;
        case "quote":
          y += 4;
          writeParagraph(`"${block.text}"`, { style: "italic", center: true });
          y += 4;
          break;
        case "problem-cards":
          for (const item of block.items) {
            writeHeading(`${item.id} — ${item.title}`, 12);
            writeParagraph(item.desc);
          }
          break;
        case "built-list":
          for (const item of block.items) {
            writeParagraph(`• ${item.id} — ${item.title}: ${item.desc}`);
          }
          break;
        case "feature-cards":
          for (const item of block.items) {
            writeHeading(item.title, 12);
            writeParagraph(item.desc);
          }
          break;
        case "developer-list":
          writeHeading(block.title, 13);
          for (const item of block.items) {
            writeParagraph(`• ${item}`);
          }
          break;
        case "roadmap":
          for (const phase of block.phases) {
            writeHeading(phase.status, 13);
            for (const item of phase.items) {
              writeParagraph(`• ${item}`);
            }
          }
          break;
        case "why-cards":
          for (const item of block.items) {
            writeHeading(item.title, 12);
            writeParagraph(item.desc);
          }
          break;
        case "closing":
          for (const p of block.paragraphs) {
            writeParagraph(p, { center: true });
          }
          y += 8;
          writeParagraph(`"${block.tagline}"`, {
            style: "bolditalic",
            center: true,
            size: 13,
          });
          y += 12;
          writeParagraph(block.disclaimer, {
            center: true,
            size: 9,
            color: "#666666",
          });
          break;
        default:
          break;
      }
    }

    if (ch.number < CHAPTERS.length) {
      doc.addPage();
      y = margin;
    }
  }

  return Buffer.from(doc.output("arraybuffer"));
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  ensureOutDir();

  const mdPath = path.join(OUT_DIR, "Arxon_Litepaper_2026.md");
  const docxPath = path.join(OUT_DIR, "Arxon_Litepaper_2026.docx");
  const pdfPath = path.join(OUT_DIR, "Arxon_Litepaper_2026.pdf");

  const md = buildMarkdown();
  fs.writeFileSync(mdPath, md, "utf8");

  const docxBuffer = await buildDocx();
  fs.writeFileSync(docxPath, docxBuffer);

  const pdfBuffer = buildPdf();
  fs.writeFileSync(pdfPath, pdfBuffer);

  const files = [mdPath, docxPath, pdfPath];
  console.log("Litepaper export complete:\n");
  for (const f of files) {
    const stat = fs.statSync(f);
    console.log(`  ${f}`);
    console.log(`    ${formatBytes(stat.size)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
