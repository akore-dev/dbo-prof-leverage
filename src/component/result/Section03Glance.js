import { useEffect, useRef, useState } from "react";
import { Gem, Eye, Compass, Shield, ChevronDown, Sparkle } from "lucide-react";
import { glanceLenses, scrollToSection, splitTrailingWord } from "./experienceUtils";

const LENS_ICONS = { valuable: Gem, seen: Eye, heading: Compass, proof: Shield };

function GlanceRow({ Icon, label, score, isLast, animate, delay = 0 }) {
  const [filled, setFilled] = useState(false);
  const percentage = Math.min(Math.max((score / 10) * 100, 4), 100);

  useEffect(() => {
    if (!animate) {
      setFilled(false);
      return undefined;
    }

    const timeout = window.setTimeout(() => setFilled(true), delay);
    return () => window.clearTimeout(timeout);
  }, [animate, delay]);

  return (
    <div className={`flex items-center gap-5 py-6 sm:gap-8 ${isLast ? "" : "border-b border-white/[0.06]"}`}>
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#D9A44A]/45 sm:h-[76px] sm:w-[76px]">
        <Icon className="h-7 w-7 text-[#D9A44A] sm:h-8 sm:w-8" strokeWidth={1.3} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-serif text-[20px] font-medium text-[#F5F1E8] sm:text-[26px]">{label}</p>
        <div className="mt-4 h-[10px] overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full rounded-full transition-[width] duration-[1100ms] ease-out"
            style={{
              width: filled ? `${percentage}%` : "0%",
              background: "linear-gradient(to right, #A87B2F, #E8B563 55%, #F3D9A4)",
              boxShadow: "0 0 14px rgba(232,181,99,0.55)",
            }}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-stretch gap-4 self-stretch sm:gap-6">
        <div className="hidden w-px bg-white/10 sm:block" />
        <p className="flex w-[76px] items-center justify-end sm:w-[96px]">
          <span className="text-[26px] font-semibold text-[#E8B563] sm:text-[32px]">
            {score.toFixed(1)}
          </span>
          <span className="text-[15px] text-slate-500 sm:text-[17px]">/10</span>
        </p>
      </div>
    </div>
  );
}

export default function Section03Glance({ snapshot, scores }) {
  const sectionRef = useRef(null);
  const [animateBars, setAnimateBars] = useState(false);
  const glanceHeading = splitTrailingWord(snapshot?.title || "At a Glance");
  const fallbackLenses = glanceLenses(scores);
  const snapshotValues = snapshot?.values ? Object.values(snapshot.values) : null;
  const lenses = snapshotValues
    ? fallbackLenses.map((lens, index) => ({ ...lens, score: Number(snapshotValues[index]) }))
    : fallbackLenses;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateBars(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="xp-section-3"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#050505] py-16"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[460px] w-[460px]"
        style={{ background: "radial-gradient(circle at center, rgba(233,190,120,0.13), transparent 62%)" }}
      />

      <div className="mx-auto w-full max-w-6xl px-6">
        <h2 className="font-serif text-[48px] font-medium leading-[1.05] text-[#F5F1E8] sm:text-[64px] md:text-[72px]">
          {glanceHeading.lead}
          <span className="text-[#D9A44A]">{glanceHeading.gold}</span>
        </h2>

        <p className="mt-5 text-[16px] leading-[1.65] text-slate-300 sm:text-[17px]">
          Four lenses. One snapshot.
          <br />
          This is where your story stands right now.
        </p>

        <div className="relative mt-6 h-px w-40 bg-gradient-to-r from-[#D9A44A]/80 to-transparent">
          <div
            className="absolute -top-[3px] left-4 h-[7px] w-20"
            style={{ background: "radial-gradient(ellipse at center, rgba(240,210,144,0.55), transparent 70%)" }}
          />
        </div>

        <div className="mt-6">
          {lenses.map((lens, index) => (
            <GlanceRow
              key={lens.key}
              Icon={LENS_ICONS[lens.key]}
              label={lens.label}
              score={lens.score}
              isLast={index === lenses.length - 1}
              animate={animateBars}
              delay={index * 180}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center gap-5 rounded-2xl border border-[#D9A44A]/20 bg-white/[0.02] px-6 py-6 sm:px-7">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#D9A44A]/45">
            <Sparkle className="h-6 w-6 text-[#D9A44A]" strokeWidth={1.4} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-medium text-[#D9A44A] sm:text-[18px]">
              Patterns are starting to connect.
            </p>
            <p className="mt-1 text-[14px] text-slate-400 sm:text-[16px]">
              Keep going â€” the bigger picture is coming into focus.
            </p>
          </div>
          <button
            type="button"
            onClick={() => scrollToSection("xp-section-4")}
            aria-label="Continue"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D9A44A]/60 text-[#D9A44A] transition hover:bg-[#D9A44A]/10"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
