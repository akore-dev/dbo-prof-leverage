import { ChevronDown } from "lucide-react";
import { scrollToSection, splitTrailingWord } from "./experienceUtils";

export default function Section02Noticed({ title, cards }) {
  const heading = splitTrailingWord(title);
  const observations = cards.map(([statement, body, quote], index) => ({
    number: String(index + 1).padStart(2, "0"),
    statement,
    body,
    quote,
  }));
  return (
    <section
      id="xp-section-2"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#070605] py-16"
    >
      {/* corner light sweep */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-[380px] w-[380px]"
        style={{ background: "radial-gradient(circle at center, rgba(233,190,120,0.14), transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rotate-12"
        style={{ background: "linear-gradient(215deg, rgba(217,164,74,0.08), transparent 45%)" }}
      />

      <div className="mx-auto w-full max-w-7xl px-6">

        <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#D9A44A] sm:text-[13px]">
          Section 2
        </p>

        <h2 className="mt-3 font-serif text-[48px] font-medium leading-[1.05] text-[#F5F1E8] sm:text-[64px] md:text-[72px]">
          {heading.lead}
          <span className="text-[#D9A44A]">{heading.gold}</span>
        </h2>

        <p className="mt-5 text-[16px] leading-[1.65] text-slate-300 sm:text-[17px]">
          Three things kept showing up across your responses.
          <br />
          Not random. Not small. They shape the bigger picture.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {observations.map(({ number, statement, body, quote }) => (
            <div
              key={number}
              className="relative flex flex-col rounded-2xl border border-[#D9A44A]/15 p-7 sm:p-8"
              style={{
                background:
                  "linear-gradient(160deg, rgba(38,30,18,0.55) 0%, rgba(16,13,9,0.9) 40%, rgba(10,9,7,0.95) 100%)",
                boxShadow: "inset 0 1px 0 rgba(240,210,144,0.08)",
              }}
            >
              <div className="flex items-start justify-between">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D9A44A]/70 font-serif text-[20px] font-semibold text-[#F0D290]"
                  style={{ boxShadow: "0 0 18px rgba(217,164,74,0.25)" }}
                >
                  {number}
                </span>
                <span className="font-serif text-[54px] leading-none text-white/15">&ldquo;</span>
              </div>

              <h3 className="mt-6 font-serif text-[24px] font-medium leading-[1.3] text-[#F5F1E8] sm:text-[26px]">
                {statement}
              </h3>

              <div className="relative mt-6 h-px w-full bg-gradient-to-r from-[#D9A44A]/50 via-[#D9A44A]/15 to-transparent">
                <div
                  className="absolute -top-[3px] left-4 h-[7px] w-16"
                  style={{ background: "radial-gradient(ellipse at center, rgba(240,210,144,0.5), transparent 70%)" }}
                />
              </div>
              <p className="mt-6 text-[14px] leading-[1.7] text-slate-300 sm:text-[15px]">
                {body}
              </p>

              <div className="mt-6 border-l-2 border-[#D9A44A]/60 pl-4">
                <p className="text-[14px] leading-[1.65] text-[#D9A44A] sm:text-[15px]">{quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-7xl px-6">
        <div className="border-t border-white/10 pt-8">
          <button
            type="button"
            onClick={() => scrollToSection("xp-section-3")}
            className="flex items-center gap-5 text-left"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D9A44A]/60 text-[#D9A44A] transition hover:bg-[#D9A44A]/10">
              <ChevronDown className="h-5 w-5" />
            </span>
            <span className="text-[15px] leading-[1.5] text-slate-200 sm:text-[16px]">
              There is more to see.
              <br />
              <span className="text-slate-400">Let&rsquo;s look at the bigger picture.</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
