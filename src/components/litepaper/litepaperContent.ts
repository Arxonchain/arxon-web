import {
  Globe,
  CheckCircle2,
  Code,
  ArrowRight,
  Shield,
  Users,
  Eye,
  Coins,
  Lock,
  Vote,
  type LucideIcon,
} from "lucide-react";

export interface ProblemCard {
  icon: LucideIcon;
  id: string;
  title: string;
  desc: string;
}

export interface BuiltItem {
  id: string;
  title: string;
  desc: string;
}

export interface FeatureCard {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface RoadmapPhase {
  status: string;
  variant: "green" | "amber" | "blue";
  items: string[];
}

export interface WhyCard {
  title: string;
  desc: string;
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "problem-cards"; items: ProblemCard[] }
  | { type: "built-list"; items: BuiltItem[] }
  | { type: "feature-cards"; items: FeatureCard[] }
  | { type: "developer-list"; title: string; items: string[] }
  | { type: "roadmap"; phases: RoadmapPhase[] }
  | { type: "why-cards"; items: WhyCard[] }
  | { type: "closing"; paragraphs: string[]; tagline: string; disclaimer: string };

export interface LitepaperChapter {
  id: string;
  slug: string;
  number: number;
  sectionId?: string;
  label?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  blocks: ContentBlock[];
  isCover?: boolean;
}

export const LITEPAPER_CHAPTERS: LitepaperChapter[] = [
  {
    id: "01",
    slug: "introduction",
    number: 1,
    title: "Sovereign Privacy Blockchain",
    subtitle: "for the Unbanked World",
    isCover: true,
    blocks: [
      {
        type: "quote",
        text: "Financial sovereignty is not a privilege. It is a right.",
      },
      {
        type: "paragraph",
        text: "This litepaper outlines Arxon's mission, the technology we have shipped, and what comes next. Arxon is a sovereign Layer-1 blockchain built for financial privacy and access — designed first for the unbanked and underbanked populations of Africa, Asia, and Latin America.",
      },
      {
        type: "paragraph",
        text: "Bitcoin proved money without banks was possible. Ethereum proved programmable money was possible. Arxon is building the next step: private, accessible, fair money for the people who need it most.",
      },
      {
        type: "paragraph",
        text: "Use the chapter navigation to read at your own pace. Each section covers a distinct part of the Arxon story — from the problem we solve to the roadmap ahead.",
      },
    ],
  },
  {
    id: "02",
    slug: "problem",
    number: 2,
    sectionId: "SECTION_01",
    label: "THE_PROBLEM",
    title: "The Problem",
    icon: Globe,
    blocks: [
      {
        type: "paragraph",
        text: "The global financial system was not built for everyone. Despite two generations of cryptocurrency innovation, over 1.4 billion adults worldwide remain without access to basic financial services. Blockchain promised to change this. In practice, the benefits have mostly flowed to those who were already financially included.",
      },
      {
        type: "paragraph",
        text: "For hundreds of millions of people, the choice is not between crypto and traditional banking — it is between cash and nothing. Public blockchains offer an alternative, but they introduce a different kind of exposure: every balance, every payment, and every counterparty is permanently visible on a public ledger.",
      },
      {
        type: "problem-cards",
        items: [
          {
            icon: Users,
            id: "P-001",
            title: "Financial Exclusion",
            desc: "Hundreds of millions in Africa, Asia, and Latin America conduct their entire financial lives in cash. Without bank accounts, they cannot save securely, access credit, or participate in the digital economy.",
          },
          {
            icon: Eye,
            id: "P-002",
            title: "Financial Surveillance",
            desc: "Public blockchains solve financial exclusion but introduce total transparency. Your wallet balance, every transaction, and every person you've ever paid is permanently visible to anyone on earth.",
          },
          {
            icon: Coins,
            id: "P-003",
            title: "The Cost of Sending Money Home",
            desc: "The Nigerian diaspora alone sends over $20 billion home yearly. At current fees of 6–8%, over $1.5 billion is extracted from the world's poorest families every single year.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "These are not abstract market failures. They are daily realities for families sending remittances, workers paid in cash, and communities locked out of credit. A blockchain built for the unbanked world must address exclusion and surveillance together — not trade one for the other.",
      },
    ],
  },
  {
    id: "03",
    slug: "built",
    number: 3,
    sectionId: "SECTION_02",
    label: "WHAT_WE_BUILT",
    title: "What We've Already Built",
    icon: CheckCircle2,
    blocks: [
      {
        type: "paragraph",
        text: "Arxon is not a whitepaper promise. The core network is live in multi-node testnet, with real miners, real transactions, and real privacy controls already in operation. Everything listed here exists today.",
      },
      {
        type: "built-list",
        items: [
          {
            id: "B-001",
            title: "A Live Sovereign Blockchain",
            desc: "Running AURA + GRANDPA consensus with a new block every six seconds in multi-node testnet configuration.",
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
            desc: "Tamper-proof records with single-use disclosure codes for third-party verification.",
          },
          {
            id: "B-006",
            title: "ARX-P Mining System",
            desc: "25k+ community of real miners earning points before mainnet, convertible to ARX tokens at launch.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "AURA + GRANDPA gives Arxon fast, deterministic finality suitable for everyday payments. EVM compatibility means developers can deploy existing Solidity contracts without rewriting tooling. The selective privacy system and private receipts are already usable on testnet — not scheduled for a distant milestone.",
      },
    ],
  },
  {
    id: "04",
    slug: "building",
    number: 4,
    sectionId: "SECTION_03",
    label: "WHAT_WE_BUILD",
    title: "What We Are Building",
    icon: Code,
    blocks: [
      {
        type: "paragraph",
        text: "The foundation is in place. The next phase adds cryptographic guarantees that make privacy mathematically enforced rather than conventionally hidden — and opens the network to applications that require both confidentiality and verifiability.",
      },
      {
        type: "feature-cards",
        items: [
          {
            icon: Lock,
            title: "Zero-Knowledge Cryptographic Privacy",
            desc: "Halo2 zero-knowledge proofs make hidden information impossible to reveal, even with complete access to the blockchain's raw data. Halo2 requires no trusted setup — the security is mathematical, not ceremonial.",
          },
          {
            icon: Vote,
            title: "On-Chain Private Voting",
            desc: "A voting system where coercion is cryptographically impossible. Voters prove eligibility without revealing identity. Results are tallied through Layer-2 ZK batch proofs — one billion votes across 10,000 batches settles on-chain in seconds.",
          },
        ],
      },
      {
        type: "developer-list",
        title: "Developer Ecosystem",
        items: [
          "Privacy-preserving DeFi — trading, lending with confidential amounts",
          "Private remittance applications for diaspora markets",
          "Confidential payroll systems with private salary information",
          "ZK voting applications for communities, DAOs, and governments",
          "Private NFT marketplaces and confidential identity systems",
        ],
      },
      {
        type: "paragraph",
        text: "These capabilities extend what Arxon already ships on testnet. Developers building on Arxon get Ethereum-compatible tooling today, with a clear path to ZK-enforced privacy and voting as those integrations reach production readiness.",
      },
    ],
  },
  {
    id: "05",
    slug: "roadmap",
    number: 5,
    sectionId: "SECTION_04",
    label: "ROADMAP",
    title: "Roadmap",
    icon: ArrowRight,
    blocks: [
      {
        type: "paragraph",
        text: "Arxon's roadmap reflects what is already complete, what is actively in development, and what follows once the public testnet and ZK integrations are production-ready. Timelines may shift as security audits and community feedback land.",
      },
      {
        type: "roadmap",
        phases: [
          {
            status: "COMPLETE",
            variant: "green",
            items: [
              "Sovereign Layer-1 blockchain in multi-node testnet",
              "ARX native token with fixed supply",
              "Full EVM compatibility, MetaMask, Solidity, all Ethereum tooling",
              "Selective privacy system, four independent per-transaction flags",
              "Private Transaction Receipt system with disclosure codes",
              "ARX-P mining system, 25k+ community",
              "On-chain ARX claim pallet for unlimited miners",
            ],
          },
          {
            status: "IN BUILDING PROCESS",
            variant: "amber",
            items: [
              "Public testnet launch, anyone can connect and transact",
              "Block explorer, browse all Arxon transactions publicly",
              "Testnet faucet for developers",
              "Validator expansion",
              "Anti-rug protection registry",
              "Developer documentation and SDK release",
              "MetaMask official chain registration",
              "Halo2 zero-knowledge proof integration",
              "Cryptographic enforcement of all four privacy flags",
              "ZK voting Phase 1 — private on-chain votes",
              "Privacy-preserving DeFi primitives",
              "Third-party ZK circuit security audit",
            ],
          },
          {
            status: "AHEAD — ECOSYSTEM",
            variant: "blue",
            items: [
              "ZK voting Phase 2, national-scale batch proof elections",
              "Remittance corridor integrations for Nigeria and diaspora",
              "Mobile wallet with built-in privacy controls",
              "Cross-chain bridges to major ecosystems",
              "Mainnet launch with ARX-P conversion",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "06",
    slug: "why-arxon",
    number: 6,
    sectionId: "SECTION_05",
    label: "WHY_ARXON",
    title: "Why Arxon",
    icon: Shield,
    blocks: [
      {
        type: "paragraph",
        text: "Arxon exists because the combination of financial exclusion and financial surveillance creates a gap no existing chain adequately addresses. Most networks optimize for traders and developers in already-banked markets. Arxon optimizes for people who need privacy and access at the same time.",
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
            desc: "Selective transaction privacy does not exist on any other production blockchain. This is not an incremental improvement — it is a new capability.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "With 25k+ active miners already participating before mainnet, Arxon also has a community that matches its mission — people earning their place on the network before launch, not speculating on a distant token event.",
      },
    ],
  },
  {
    id: "07",
    slug: "closing",
    number: 7,
    title: "Built For the World",
    blocks: [
      {
        type: "closing",
        paragraphs: [
          "Bitcoin proved money without banks was possible. Ethereum proved programmable money was possible. Arxon is proving that private, accessible, fair money is possible — and building it for the people who need it most.",
        ],
        tagline: "Arxon is Built For the World.",
        disclaimer:
          "DISCLAIMER: This litepaper is for informational purposes only. It does not constitute financial advice or an offer of any kind. Arxon is in active development.",
      },
    ],
  },
];

export const CHAPTER_BY_SLUG = Object.fromEntries(
  LITEPAPER_CHAPTERS.map((ch) => [ch.slug, ch])
) as Record<string, LitepaperChapter>;

export const TOTAL_CHAPTERS = LITEPAPER_CHAPTERS.length;
