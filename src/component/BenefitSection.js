import { Fingerprint, ShieldCheck, Gem, Eye, Compass, CircleX, UserRound, MessageCircleMore } from "lucide-react";
import SectionHeading from "./SectionHeading";

const benefits = [
  { text: "Your Professional Pattern", Icon: Fingerprint, color: "#3EC9B0" },
  { text: "Hidden risks that may be slowing you down", Icon: ShieldCheck, color: "#D9A44A" },
  { text: "Where untapped value may be sitting", Icon: Gem, color: "#D9A44A" },
  { text: "What your current scores may be opening up", Icon: Eye, color: "#D9A44A" },
  { text: "A deeper interpretation of what your results may mean", Icon: Compass, color: "#D9A44A" }
];

const noFluff = [
  { text: "No fluff.", Icon: CircleX },
  { text: "No personality test.", Icon: UserRound },
  { text: "No generic advice.", Icon: MessageCircleMore }
];

const glow = (color) => ({ filter: `drop-shadow(0 0 6px ${color}66)` });

export default function BenefitsSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 md:py-14">

      <SectionHeading>WHAT YOU'LL GET</SectionHeading>

      {/* Desktop: five columns with vertical dividers */}
      <div className="hidden grid-cols-5 md:grid">
        {benefits.map(({ text, Icon, color }) => (
          <div
            key={text}
            className="flex flex-col items-center border-r border-[#D9A44A]/20 px-6 text-center last:border-none"
          >
            <Icon size={44} strokeWidth={1.4} style={{ color, ...glow(color) }} />
            <p className="mt-5 max-w-[190px] text-[15px] leading-[1.6] text-gray-300">
              {text}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile: icon rows */}
      <div className="md:hidden">
        {benefits.map(({ text, Icon, color }, i) => (
          <div
            key={text}
            className={`flex items-center gap-5 py-4 ${i > 0 ? "border-t border-white/10" : ""}`}
          >
            <Icon size={30} strokeWidth={1.4} className="shrink-0" style={{ color, ...glow(color) }} />
            <p className="text-[16px] leading-[1.55] text-gray-200">{text}</p>
          </div>
        ))}
      </div>

      {/* Desktop: "No fluff" statement block */}
      <div className="mx-auto mt-16 hidden max-w-[560px] border-t border-[#D9A44A]/20 pt-12 text-center md:block">
        <p className="font-serif text-[26px] leading-[1.7] text-[#F5F1E8]">
          No fluff.
          <br />
          No personality test.
          <br />
          No generic advice.
        </p>

        <p className="mt-8 font-serif text-[21px] leading-[1.6] text-[#E8E2D4]">
          Just a sharper read on where your career
          <br />
          may be carrying hidden friction.
        </p>
      </div>

      {/* Mobile: "No fluff, no noise" cards */}
      <div className="mt-12 md:hidden">
        <h3 className="text-center font-serif text-[17px] font-semibold tracking-[0.2em] text-[#D9A44A]">
          NO FLUFF. NO NOISE.
        </h3>

        <div className="mt-6 space-y-4">
          {noFluff.map(({ text, Icon }) => (
            <div
              key={text}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#10161F] px-5 py-4"
            >
              <Icon size={24} strokeWidth={1.5} className="shrink-0 text-[#D9A44A]" />
              <p className="text-[16px] text-gray-100">{text}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-[300px] text-center text-[17px] leading-[1.65] text-gray-200">
          Just a sharper read on where your career may be carrying hidden friction.
        </p>

        <div className="mx-auto mt-10 h-px w-32 bg-[#D9A44A]/30" />
      </div>

    </section>
  );
}
