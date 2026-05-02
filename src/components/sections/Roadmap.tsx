import { useState } from "react";
import { ChevronDown, Check, Zap, Wallet, BookOpen, FileText, Video, ClipboardCheck } from "lucide-react";
import { DemoClassDialog } from "@/components/DemoClassDialog";
import { EnrollDialog } from "@/components/EnrollDialog";
import { Button } from "@/components/ui/button";

// ---------- Types ----------
type Lecture = {
  code: string;
  text: string;
  warn?: boolean; // "DO NOT SKIP"
};

type Phase = {
  id: number;
  numLabel: string; // "00", "01"…
  color: string; // hex
  tag: string; // "PHASE 01 · CHAPTER 3"
  title: string;
  weekLabel: string; // "Week 1–3" or "Free" or "Bonus"
  lectureCount: string; // "16 Lectures" or "5 Items"
  extraPill?: { label: string; tone: "emerald" | "pink" };
  lectures: Lecture[];
  // Phase 05 has split layout
  examLectures?: Lecture[];
  goal: string;
  chips: string[];
  tipLabel: string;
  tip: string;
  crossLink?: string; // Phase 02
  keywordCallout?: string; // Phase 04
};

// ---------- Data ----------
const phases: Phase[] = [
  {
    id: 0,
    numLabel: "00",
    color: "#00d4ff",
    tag: "PHASE 00 · MINDSET",
    title: "Before You Begin — Mindset & Orientation",
    weekLabel: "Free",
    lectureCount: "5 Items",
    lectures: [
      { code: "PRE-01", text: "What HSC ICT actually tests vs what students think — the real exam anatomy" },
      { code: "PRE-02", text: "How to use this platform and navigate all 5 content phases" },
      { code: "PRE-03", text: "Study habits, time blocking, and paper practice discipline" },
      { code: "PRE-04", text: "What separates A from A+ — the 5 to 7 mark gap strategy" },
      { code: "PRE-05", text: "Exam anxiety, motivation systems, and building a daily study streak" },
    ],
    goal: "The ignition phase. No chapters, no code — pure foundation. This is where the mindset for A+ is built before a single lecture begins.",
    chips: ["Free Access", "Mindset", "Study Strategy", "Platform Tour"],
    tipLabel: "Note",
    tip: "This phase is free for every student. Complete it before touching any chapter — students who skip orientation consistently underperform by 8 to 12 marks.",
  },
  {
    id: 1,
    numLabel: "01",
    color: "#00d4ff",
    tag: "PHASE 01 · CHAPTER 3",
    title: "Digital Logic & Number Systems",
    weekLabel: "Week 1–3",
    lectureCount: "16 Lectures",
    lectures: [
      { code: "ICT-01", text: "Number systems — history, decimal, binary, octal, hexadecimal" },
      { code: "ICT-02", text: "Decimal to any base conversions" },
      { code: "ICT-03", text: "Any base to decimal conversions" },
      { code: "ICT-04", text: "Cross-base conversions, binary addition" },
      { code: "ICT-05", text: "Binary subtraction, 1's complement, 2's complement" },
      { code: "ICT-06", text: "Codes — BCD, ASCII, EBCDIC, Unicode" },
      { code: "ICT-07", text: "Boolean algebra — theorems, truth tables" },
      { code: "ICT-08", text: "Boolean functions, simplification, basic logic gates" },
      { code: "ICT-09", text: "Compound gates, Universal gates NAND and NOR, NAND-only circuits" },
      { code: "ICT-10", text: "NOR-only circuits, expression to circuit conversions" },
      { code: "ICT-11", text: "Logic function simplification, truth-table to function" },
      { code: "ICT-12", text: "Half adder, Full adder" },
      { code: "ICT-13", text: "Full adder from half adders, parallel binary adder" },
      { code: "ICT-14", text: "Latch, clock pulses, Flip-flops SR JK D T", warn: true },
      { code: "ICT-15", text: "Register, Counter", warn: true },
      { code: "ICT-16", text: "Creative question practice and full chapter revision" },
    ],
    goal: "The heavyweight opener — 16 lectures, 2 CQs, 5 to 6 MCQ marks. Practice conversions daily. Flip-flops and registers are advanced but appear in MCQs to catch students off-guard.",
    chips: ["2 CQs", "16 Lectures", "Math-Heavy", "Daily Practice", "High Weightage"],
    tipLabel: "Warning Zone",
    tip: "2's complement subtraction is guaranteed every year. Practice minimum 15 varied problems. NAND and NOR universal gate circuits are another guaranteed sub-question.",
  },
  {
    id: 2,
    numLabel: "02",
    color: "#a78bfa",
    tag: "PHASE 02 · CHAPTER 5",
    title: "C Programming Mastery",
    weekLabel: "Week 4–6",
    lectureCount: "16 Lectures",
    lectures: [
      { code: "ICT-17", text: "Programming languages — generations 1st through 5th" },
      { code: "ICT-18", text: "Translator programs — compiler, interpreter, assembler" },
      { code: "ICT-19", text: "Program development, algorithm, flowchart symbols and rules" },
      { code: "ICT-20", text: "Algorithm and flowchart examples" },
      { code: "ICT-21", text: "C history, program structure, constants, variables, data types" },
      { code: "ICT-22", text: "All operators and operator precedence" },
      { code: "ICT-23", text: "Ternary operator, keywords, library functions and header files" },
      { code: "ICT-24", text: "Input and Output, format specifiers, escape sequences" },
      { code: "ICT-25", text: "Control statements — if, if-else, if-else if-else" },
      { code: "ICT-26", text: "switch-case-default, goto statement" },
      { code: "ICT-27", text: "for loop, while loop, do-while loop — entry vs exit controlled" },
      { code: "ICT-28", text: "Arrays — concept, declaration, element access" },
      { code: "ICT-29", text: "1D, 2D, 3D arrays" },
      { code: "ICT-30", text: "Strings (character arrays)" },
      { code: "ICT-31", text: "Functions and user-defined functions" },
      { code: "ICT-32", text: "Scope and boundaries of variables, creative question practice" },
    ],
    crossLink:
      "Logic gates in Phase 01 taught you AND, OR, NOT — now apply that thinking directly in if-else and switch statements.",
    goal: "The hardest chapter — 16 lectures, 2 CQs, 5 to 6 MCQ marks. Spend 3 full weeks. Trace every program by hand. Series summation, Leap Year, and Fibonacci are guaranteed exam questions.",
    chips: ["Hardest Chapter", "2 CQs", "3 Weeks", "Trace by Hand", "16 Lectures"],
    tipLabel: "Warning Zone",
    tip: "i++ vs ++i, unclosed braces, wrong loop termination — top 3 errors every year. Write every program twice: once for logic, once for syntax.",
  },
  {
    id: 3,
    numLabel: "03",
    color: "#34d399",
    tag: "PHASE 03 · CHAPTER 4",
    title: "Web Design & HTML",
    weekLabel: "Week 7",
    lectureCount: "8 Lectures",
    extraPill: { label: "Recovery Week", tone: "emerald" },
    lectures: [
      { code: "ICT-33", text: "Internet and web intro — static vs dynamic, URL, Domain, Network Protocol" },
      { code: "ICT-34", text: "Website structures — Tree, Weblinked, Sequential, Hybrid — web publishing" },
      { code: "ICT-35", text: "HTML basics — versions, elements, tags, DOCTYPE, HEAD tags" },
      { code: "ICT-36", text: "BODY tags — heading tags, text formatting tags" },
      { code: "ICT-37", text: "Style attribute and CSS — inline and internal styling" },
      { code: "ICT-38", text: "Hyperlinks, image insertion, background image, lists" },
      { code: "ICT-39", text: "Tables — colspan, rowspan; Forms — input types" },
      { code: "ICT-40", text: "Semantic elements, special terminology, creative question practice" },
    ],
    goal: "Your well-earned breather after two brutal chapters. One sharp week is enough. Write clean HTML on paper. Rowspan and colspan in tables is the number one most-tested HTML sub-question.",
    chips: ["Quick Win", "Recovery Week", "Paper Coding", "1 CQ", "Easy Marks"],
    tipLabel: "Winning Move",
    tip: "Write every table exercise on paper not a screen. Memorize the table skeleton cold: html → body → table → tr → td. Rowspan and colspan appear every single year.",
  },
  {
    id: 4,
    numLabel: "04",
    color: "#f87171",
    tag: "PHASE 04 · CHAPTERS 1 & 2",
    title: "ICT World, Bangladesh & Networking",
    weekLabel: "Week 8–9",
    lectureCount: "6 Lectures",
    lectures: [
      { code: "ICT-41", text: "ICT and Bangladesh — digital BD, global village, VR, Robotics, AI applications" },
      { code: "ICT-42", text: "Biometrics, Bioinformatics, Genetic Engineering, Nanotechnology, Cyber crime" },
      { code: "ICT-43", text: "Data communication — signals, bandwidth, transmission methods, simplex/duplex" },
      { code: "ICT-44", text: "Wireless media — radio wave, microwave, infrared, Wi-Fi, WiMAX, Bluetooth, mobile generations" },
      { code: "ICT-45", text: "Wired media — twisted pair, coaxial, fiber optic; Networking types and classification" },
      { code: "ICT-46", text: "NIC, modem, hub, switch, router, gateway; Topology, Cloud Computing, creative question" },
    ],
    keywordCallout: "This phase is won by vocabulary, not calculation. Build a flashcard deck.",
    goal: "Two theory-heavy chapters in one phase. Keyword-driven — deep understanding beats rote memorisation. Cloud Computing and VR are perennial CQ favourites.",
    chips: ["Pure Theory", "Keyword Drilling", "2 Chapters", "Definitions", "Flashcards"],
    tipLabel: "Pro Tip",
    tip: "Examiners reward specific keywords. \"Low latency\" for fiber, \"licence-free\" for Bluetooth, \"geostationary orbit\" for satellite microwave. A keyword flashcard deck alone can secure 5 to 6 easy MCQ marks.",
  },
  {
    id: 5,
    numLabel: "05",
    color: "#fbbf24",
    tag: "PHASE 05 · CHAPTER 6",
    title: "Database Management & Final Revision",
    weekLabel: "Week 10",
    lectureCount: "8 + 4 Items",
    lectures: [
      { code: "ICT-47", text: "Database — data vs information, DBMS concept, spreadsheet vs DBMS" },
      { code: "ICT-48", text: "Database storage, advantages of DBMS, real-world use cases" },
      { code: "ICT-49", text: "Table, Field, Record, Entity, Attribute, Value, Data types" },
      { code: "ICT-50", text: "Relational DB, RDBMS features, Keys overview" },
      { code: "ICT-51", text: "Primary Key, Composite Key, Foreign Key — differences and constraints" },
      { code: "ICT-52", text: "Relations One-to-One, One-to-Many, Many-to-Many; ERD" },
      { code: "ICT-53", text: "SQL — CRUD, DML vs DDL, CREATE READ UPDATE DELETE" },
      { code: "ICT-54", text: "Data Encryption; creative question practice and full syllabus revision" },
    ],
    examLectures: [
      { code: "EXAM-01", text: "Full syllabus mock paper under timed conditions" },
      { code: "EXAM-02", text: "Daily OMR practice on physical answer sheet" },
      { code: "EXAM-03", text: "Mistake log review — document every error from all phases" },
      { code: "EXAM-04", text: "CQ answer writing speed drills — keyword density optimization" },
    ],
    goal: "Wrap up DBMS in one week then shift to exam simulation mode. Final week is consolidation only — zero new content. Review every mistake from all previous phases.",
    chips: ["DBMS", "SQL", "ERD", "OMR Practice", "Mock Tests", "Final Push"],
    tipLabel: "Elite Tip",
    tip: "Foreign Key constraints and SQL CRUD queries are the two most-failed DBMS sub-questions. Treat daily OMR mock tests as sacred — one wrong MCQ mark is permanent.",
  },
  {
    id: 6,
    numLabel: "06",
    color: "#f472b6",
    tag: "PHASE 06 · BONUS",
    title: "AI in Education — Free Session",
    weekLabel: "After Course",
    lectureCount: "6 Items",
    extraPill: { label: "FREE BONUS", tone: "pink" },
    lectures: [
      { code: "AI-01", text: "What is AI and how it actually works — demystified for HSC students" },
      { code: "AI-02", text: "Using ChatGPT and Claude to explain difficult ICT concepts instantly" },
      { code: "AI-03", text: "Generating your own practice questions and mock CQs with AI" },
      { code: "AI-04", text: "Using AI to debug and trace C programs — a student's secret weapon" },
      { code: "AI-05", text: "Building personalized flashcard decks using AI for Chapter 1 and 2" },
      { code: "AI-06", text: "How AI will shape education, careers, and Bangladesh's future" },
    ],
    goal: "The reward at the end of the journey. Learn to use AI as your permanent study companion — not just for HSC but for everything beyond it. This session is free and open to all students.",
    chips: ["Free Access", "Bonus Session", "AI Tools", "Future Skills", "No Exam"],
    tipLabel: "Gift",
    tip: "Students who learn to use AI tools effectively study in half the time with double the retention. This is the unfair advantage your seniors never had.",
  },
];

// ---------- Helpers ----------
const hexA = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// ---------- Sub-components ----------
function LectureRow({ l, color }: { l: Lecture; color: string }) {
  return (
    <li className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
      <span
        className="shrink-0 mt-0.5 px-2 py-0.5 rounded-md font-mono text-[10px] tracking-wider font-bold"
        style={{
          color,
          backgroundColor: hexA(color, 0.1),
          border: `1px solid ${hexA(color, 0.35)}`,
        }}
      >
        {l.code}
      </span>
      <span className="text-sm text-foreground/90 leading-relaxed flex-1">
        {l.text}
        {l.warn && (
          <span
            className="ml-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider align-middle"
            style={{
              color: "#fca5a5",
              backgroundColor: "rgba(248, 113, 113, 0.12)",
              border: "1px solid rgba(248, 113, 113, 0.4)",
            }}
          >
            DO NOT SKIP
          </span>
        )}
      </span>
    </li>
  );
}

function PhaseCard({
  p,
  isOpen,
  onToggle,
  index,
}: {
  p: Phase;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      id={`phase-${p.id}`}
      className="rounded-[14px] bg-card/60 backdrop-blur transition-all duration-300 animate-phase-in"
      style={{
        border: `1px solid ${isOpen ? p.color : "var(--border)"}`,
        boxShadow: isOpen ? `0 0 24px ${hexA(p.color, 0.35)}, 0 0 60px ${hexA(p.color, 0.12)}` : "none",
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-3 md:gap-4 p-4 md:p-5 text-left"
      >
        {/* Number badge */}
        <div
          className="shrink-0 w-[46px] h-[46px] rounded-xl flex items-center justify-center font-mono font-bold text-base transition-all duration-300"
          style={{
            backgroundColor: isOpen ? p.color : hexA(p.color, 0.08),
            color: isOpen ? "#0A0F1A" : p.color,
            border: `1px solid ${isOpen ? p.color : hexA(p.color, 0.35)}`,
            boxShadow: isOpen ? `0 0 20px ${hexA(p.color, 0.7)}` : "none",
          }}
        >
          {p.numLabel}
        </div>

        {/* Title block */}
        <div className="flex-1 min-w-0">
          <p
            className="font-mono text-[10px] md:text-xs tracking-widest"
            style={{ color: p.color }}
          >
            {p.tag}
          </p>
          <h3 className="text-base md:text-lg font-bold leading-tight mt-0.5 truncate">
            {p.title}
          </h3>
        </div>

        {/* Right meta */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] text-muted-foreground inline-flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-muted-foreground" /> {p.lectureCount}
          </span>
          <span
            className="font-mono text-[10px] font-bold px-2 py-1 rounded-full"
            style={{
              color: p.color,
              backgroundColor: hexA(p.color, 0.1),
              border: `1px solid ${hexA(p.color, 0.4)}`,
            }}
          >
            {p.weekLabel}
          </span>
          {p.extraPill && (
            <span
              className="font-mono text-[10px] font-bold px-2 py-1 rounded-full"
              style={{
                color: p.extraPill.tone === "pink" ? "#f472b6" : "#34d399",
                backgroundColor: p.extraPill.tone === "pink" ? "rgba(244,114,182,0.12)" : "rgba(52,211,153,0.12)",
                border: `1px solid ${p.extraPill.tone === "pink" ? "rgba(244,114,182,0.5)" : "rgba(52,211,153,0.5)"}`,
                boxShadow: p.extraPill.tone === "pink" ? "0 0 12px rgba(244,114,182,0.5)" : "none",
              }}
            >
              {p.extraPill.label}
            </span>
          )}
        </div>

        <ChevronDown
          className="shrink-0 h-5 w-5 transition-transform duration-300 text-muted-foreground"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: isOpen ? p.color : undefined,
          }}
        />
      </button>

      {/* Mobile meta row (always visible) */}
      <div className="flex sm:hidden flex-wrap gap-1.5 px-4 pb-3 -mt-2">
        <span className="font-mono text-[9px] text-muted-foreground">{p.lectureCount}</span>
        <span
          className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ color: p.color, backgroundColor: hexA(p.color, 0.1), border: `1px solid ${hexA(p.color, 0.4)}` }}
        >
          {p.weekLabel}
        </span>
        {p.extraPill && (
          <span
            className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            style={{
              color: p.extraPill.tone === "pink" ? "#f472b6" : "#34d399",
              backgroundColor: p.extraPill.tone === "pink" ? "rgba(244,114,182,0.12)" : "rgba(52,211,153,0.12)",
              border: `1px solid ${p.extraPill.tone === "pink" ? "rgba(244,114,182,0.5)" : "rgba(52,211,153,0.5)"}`,
            }}
          >
            {p.extraPill.label}
          </span>
        )}
      </div>

      {/* Accordion body (grid trick) */}
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-4 md:px-6 pb-6 pt-2">
            {/* Cross-link callout for Phase 02 */}
            {p.crossLink && (
              <div
                className="mb-4 rounded-lg p-3 text-sm font-mono"
                style={{
                  backgroundColor: hexA(p.color, 0.08),
                  border: `1px dashed ${hexA(p.color, 0.5)}`,
                  color: hexA(p.color, 0.95),
                }}
              >
                ↳ {p.crossLink}
              </div>
            )}

            {p.id === 5 ? (
              // Phase 05 split layout
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p
                    className="font-mono text-[10px] tracking-widest mb-3 pb-2 border-b"
                    style={{ color: p.color, borderColor: hexA(p.color, 0.3) }}
                  >
                    DBMS CONTENT
                  </p>
                  <ul className="space-y-0">
                    {p.lectures.map((l) => (
                      <LectureRow key={l.code} l={l} color={p.color} />
                    ))}
                  </ul>
                </div>
                <div>
                  <p
                    className="font-mono text-[10px] tracking-widest mb-3 pb-2 border-b"
                    style={{ color: p.color, borderColor: hexA(p.color, 0.3) }}
                  >
                    EXAM SIMULATION MODE
                  </p>
                  <ul className="space-y-0">
                    {p.examLectures!.map((l) => (
                      <LectureRow key={l.code} l={l} color={p.color} />
                    ))}
                  </ul>
                  <GoalBox p={p} />
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: lectures */}
                <div>
                  <ul className="space-y-0">
                    {p.lectures.map((l) => (
                      <LectureRow key={l.code} l={l} color={p.color} />
                    ))}
                  </ul>
                </div>
                {/* Right: goal */}
                <div>
                  {p.keywordCallout && (
                    <div
                      className="mb-3 rounded-lg p-3 text-xs font-mono"
                      style={{
                        backgroundColor: hexA(p.color, 0.08),
                        border: `1px dashed ${hexA(p.color, 0.5)}`,
                        color: hexA(p.color, 0.95),
                      }}
                    >
                      💡 {p.keywordCallout}
                    </div>
                  )}
                  <GoalBox p={p} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalBox({ p }: { p: Phase }) {
  return (
    <div
      className="rounded-xl p-4 mt-2"
      style={{
        backgroundColor: hexA(p.color, 0.04),
        border: `1px solid ${hexA(p.color, 0.25)}`,
      }}
    >
      <p className="font-mono text-[10px] tracking-widest mb-2" style={{ color: p.color }}>
        PHASE GOAL
      </p>
      <p className="text-sm text-foreground/90 leading-relaxed">{p.goal}</p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {p.chips.map((c) => (
          <span
            key={c}
            className="px-2 py-0.5 rounded-full text-[10px] font-mono"
            style={{
              color: p.color,
              backgroundColor: hexA(p.color, 0.1),
              border: `1px solid ${hexA(p.color, 0.3)}`,
            }}
          >
            {c}
          </span>
        ))}
      </div>

      <div
        className="mt-3 pl-3 py-2 pr-2 rounded-r-md"
        style={{
          borderLeft: `3px solid ${p.color}`,
          backgroundColor: hexA(p.color, 0.06),
        }}
      >
        <p className="font-mono text-[10px] tracking-widest mb-1" style={{ color: p.color }}>
          {p.tipLabel.toUpperCase()}
        </p>
        <p className="text-xs text-foreground/85 leading-relaxed">{p.tip}</p>
      </div>
    </div>
  );
}

// ---------- Main ----------
export function Roadmap() {
  const [openId, setOpenId] = useState<number | null>(0);

  const handleSegment = (id: number) => {
    setOpenId(id);
    setTimeout(() => {
      document.getElementById(`phase-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const toggle = (id: number) => setOpenId((curr) => (curr === id ? null : id));

  return (
    <section id="roadmap" className="relative py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--cyber-cyan)]/40 bg-card/50 backdrop-blur text-[11px] font-mono text-[var(--cyber-cyan)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cyber-cyan)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--cyber-cyan)]" />
            </span>
            Binary Academy ICT Full Course · 2025/2026
          </div>

          <h2 className="mt-5 text-3xl md:text-5xl font-bold leading-tight">
            Your Roadmap to{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00d4ff 0%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              HSC ICT A+
            </span>
          </h2>

          <p className="mt-3 font-mono text-xs md:text-sm text-muted-foreground">
            54 lectures · 6 chapters · 7 phases · engineered for A+
          </p>

          {/* Stat strip */}
          <div className="mt-6 inline-flex items-stretch rounded-xl border border-border bg-card/40 backdrop-blur overflow-hidden">
            {[
              { v: "54", l: "Lectures" },
              { v: "6", l: "Chapters" },
              { v: "10", l: "Weeks" },
              { v: "A+", l: "Target" },
            ].map((s, i, arr) => (
              <div
                key={s.l}
                className={`px-4 md:px-6 py-3 ${i < arr.length - 1 ? "border-r border-border" : ""}`}
              >
                <div className="text-lg md:text-2xl font-mono font-bold text-[var(--cyber-cyan)]">{s.v}</div>
                <div className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-10 flex gap-1.5">
          {phases.map((p) => {
            const active = openId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSegment(p.id)}
                aria-label={`Jump to ${p.title}`}
                className="flex-1 h-[3px] rounded-full transition-all duration-300"
                style={{
                  backgroundColor: active ? p.color : "var(--border)",
                  boxShadow: active ? `0 0 12px ${hexA(p.color, 0.8)}` : "none",
                  opacity: active ? 1 : 0.5,
                }}
              />
            );
          })}
        </div>

        {/* ENROLLMENT BANNER */}
        <div
          className="mt-8 rounded-2xl p-5 md:p-6 bg-card/60 backdrop-blur"
          style={{
            border: "1px solid rgba(0, 212, 255, 0.4)",
            boxShadow: "0 0 24px rgba(0, 212, 255, 0.18), inset 0 0 30px rgba(0, 212, 255, 0.04)",
          }}
        >
          <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-center">
            {/* Left: batch + seats */}
            <div>
              <p className="font-mono text-[10px] tracking-widest text-[var(--cyber-cyan)]">CURRENT BATCH</p>
              <h3 className="text-lg md:text-xl font-bold mt-1">SSC '26 / HSC '26 Batch</h3>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">Starts Week 1 · 10-Week Sprint</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-xs font-mono text-red-400">32 / 50 seats taken — filling fast</span>
              </div>
            </div>

            {/* Middle: price + includes */}
            <div className="md:border-x md:border-border md:px-6">
              <p className="font-mono text-[10px] tracking-widest text-[var(--cyber-cyan)]">PRICE</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl md:text-3xl font-mono font-bold">৳3,999</span>
                <span className="text-xs text-muted-foreground">/full course</span>
              </div>
              <ul className="mt-3 space-y-1">
                {[
                  { i: <Video className="h-3 w-3" />, t: "Live Classes" },
                  { i: <BookOpen className="h-3 w-3" />, t: "Recorded Backup" },
                  { i: <FileText className="h-3 w-3" />, t: "PDF Notes" },
                  { i: <ClipboardCheck className="h-3 w-3" />, t: "Mock Tests" },
                ].map((f) => (
                  <li key={f.t} className="flex items-center gap-2 text-xs text-foreground/85">
                    <Check className="h-3 w-3 text-[var(--cyber-green)]" /> {f.t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: payment + CTA */}
            <div>
              <p className="font-mono text-[10px] tracking-widest text-[var(--cyber-cyan)]">ACCEPTED PAYMENT</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["bKash", "Nagad", "Rocket", "Bank"].map((pay) => (
                  <span
                    key={pay}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono border border-border bg-background/50"
                  >
                    <Wallet className="h-3 w-3 text-[var(--cyber-cyan)]" /> {pay}
                  </span>
                ))}
              </div>
              <EnrollDialog
                trigger={
                  <Button
                    className="mt-4 w-full h-12 font-bold text-black animate-pulse-glow"
                    style={{
                      background: "linear-gradient(135deg, #00d4ff 0%, #00FFFF 100%)",
                    }}
                  >
                    <Zap className="mr-2 h-4 w-4" /> Enroll Now
                  </Button>
                }
              />
            </div>
          </div>
        </div>

        {/* PHASE ACCORDION */}
        <div className="mt-10 flex flex-col gap-3">
          {phases.map((p, i) => (
            <PhaseCard
              key={p.id}
              p={p}
              isOpen={openId === p.id}
              onToggle={() => toggle(p.id)}
              index={i}
            />
          ))}
        </div>

        {/* Post-roadmap demo CTA */}
        <div className="relative mt-16 mb-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-background"
          />
          <div className="relative flex flex-col items-center text-center">
            <p className="font-mono text-xs text-[var(--cyber-cyan)] tracking-widest mb-3">
              START YOUR JOURNEY
            </p>
            <DemoClassDialog />
            <p className="mt-3 text-xs text-muted-foreground">
              No payment required · 100% Free · Direct from Mentor
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
