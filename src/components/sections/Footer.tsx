import { Facebook, Youtube, MapPin, Phone } from "lucide-react";
import logo from "@/assets/binary-academy-logo.png";

export function Footer() {
  return (
    <footer className="relative border-t border-border py-12 px-4 mt-10">
      <div className="container mx-auto max-w-5xl grid md:grid-cols-3 gap-8">
        <div>
          <img src={logo} alt="Binary Academy" loading="lazy" className="w-24" />
          <p className="mt-3 text-sm text-muted-foreground">
            শিক্ষা যেখানে আনন্দ, সাফল্য যেখানে লক্ষ্য।
          </p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-mono text-[var(--cyber-cyan)] uppercase text-xs tracking-widest">যোগাযোগ</p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[var(--cyber-green)]" /> Mukterpara, Netrokona</p>
          <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[var(--cyber-green)]" /> WhatsApp: 01580611996</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-mono text-[var(--cyber-cyan)] uppercase text-xs tracking-widest">Follow</p>
          <a href="https://www.facebook.com/ahmed.shahariyar.12" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--cyber-cyan)]">
            <Facebook className="h-4 w-4" /> Ahmed Shahriyar
          </a>
          <a href="https://www.youtube.com/@binaryAcademyICT" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--cyber-cyan)]">
            <Youtube className="h-4 w-4" /> @binaryAcademyICT
          </a>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-10 font-mono">
        © {new Date().getFullYear()} Binary Academy · HSC ICT Complete Course · SSC '26
        <a
          href="/admin-binary"
          aria-label="."
          className="ml-1 text-background hover:text-[var(--cyber-cyan)] transition-colors select-none"
        >
          .
        </a>
      </p>
    </footer>
  );
}
