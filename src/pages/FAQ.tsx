import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";

const FAQ = () => {
  return (
    <div className="min-h-screen py-12 px-6">
      <BackButton />
      <div className="container mx-auto max-w-4xl pt-8">
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">What is Arxon?</AccordionTrigger>
            <AccordionContent>
              <p>Arxon is a <strong>privacy-first Layer-1 blockchain</strong> that lets you send money, vote, and create tokens all with <strong>one-tap privacy</strong>. It's fast (transction is instant), cheap (less than $0.01), and built for real people.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">When does mining start?</AccordionTrigger>
            <AccordionContent>
              <p><strong>JAN 2026</strong>, GPU/CPU mining via a simple web app. No expensive rigs. Open source.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">What is the $ARX token used for?</AccordionTrigger>
            <AccordionContent>
              <p>$ARX powers everything:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Pay fees (or earn them via staking)</li>
                <li>Vote in governance</li>
                <li>Create memecoins/NFTs</li>
                <li>Earn rewards (mining/staking)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">How does privacy work?</AccordionTrigger>
            <AccordionContent>
              <p>Every transaction has a <strong>privacy toggle</strong>. Turn it on →</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Amount hidden from public</li>
                <li>Only you + receiver see details</li>
                <li>Wallet balance fully shielded</li>
                <li>Auto-receipt attached (uneditable)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">When is the private voting dApp coming?</AccordionTrigger>
            <AccordionContent>
              <p><strong>2026</strong>, Alpha pilots with local communities.</p>
              <p className="mt-2">NATIONAL ELECTION INTEGRATION by <strong>2026-2027</strong>.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">Is Arxon open source?</AccordionTrigger>
            <AccordionContent>
              <p><strong>100% open source</strong> on <a href="https://github.com/arxonchain" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.</p>
              <p className="mt-2">Full audit before TGE.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">Can I invest in the seed round?</AccordionTrigger>
            <AccordionContent>
              <p>Yes! Reach out to us to learn more:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Email us at <a href="mailto:arxonchain@yahoo.com" className="text-primary hover:underline">arxonchain@yahoo.com</a></li>
                <li><Link to="/investor-form" className="text-primary hover:underline">Apply for Pre-Seed Investment</Link></li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-11" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">Is Arxon secure?</AccordionTrigger>
            <AccordionContent>
              <p>Yes:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Rust core</strong> (no crashes)</li>
                <li><strong>ZKPs</strong> for privacy</li>
                <li><strong>CertiK audit</strong> pre-TGE</li>
                <li><strong>Bug bounty</strong> program</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-12" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left">How do I stay updated?</AccordionTrigger>
            <AccordionContent>
              <p>Join:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><a href="https://t.me/ArxonOfficial" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Telegram</a></li>
                <li><a href="https://twitter.com/ARXONarx" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Twitter</a></li>
                 <li><a href="https://twitter.com/ARXONarx" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Discord</a></li>
                <li>Turn on notifications 🔔</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
