import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { DIAGNOSTIC_QUESTIONS, QUESTION_BANDS } from "../data/diagnosticQuestions";

const getBandIndex = (score) => (score <= 3 ? 0 : score <= 6 ? 1 : score <= 8 ? 2 : 3);

export default function ResultCard({ category, score, onAdjust, onConfirm }) {
  const bandIndex = getBandIndex(score);
  const bandKey = QUESTION_BANDS[bandIndex];
  const question = DIAGNOSTIC_QUESTIONS.find((item) => item.category === category);
  const band = question?.bands?.[bandKey];
  const title = band?.title ?? `A ${bandKey} in ${category} often looks like:`;
  const bullets = band?.bullets ?? [];

  return (
    <section className="w-full mt-12 flex flex-col items-center" aria-live="polite">
      <div className="w-full max-w-5xl mx-auto bg-[#0D1420] border border-white/10 rounded-xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex justify-center md:justify-start">
            <div className="w-12 h-12 shrink-0 rounded-full border border-[#D9A44A]/30 bg-[#131B29] flex items-center justify-center">
              <Sparkles className="text-[#D9A44A]" size={22} />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-[#D9A44A] text-[19px] md:text-[21px] font-semibold mb-4">{title}</h2>
            <ul className="space-y-3 text-gray-300 text-[14px] md:text-[15px] leading-relaxed text-left">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="text-[#D9A44A]">&bull;</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-7 w-full border-t border-white/10 pt-6 flex flex-col md:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={onAdjust}
            className="w-full md:flex-1 h-12 border border-[#D9A44A] bg-transparent text-[#D9A44A] rounded-lg text-[15px] font-medium flex items-center justify-center transition hover:bg-[#D9A44A]/10"
          >
            Adjust Score
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full md:flex-1 h-12 rounded-lg bg-gradient-to-b from-[#E8B563] to-[#D9A44A] text-[#161005] text-[15px] font-semibold flex items-center justify-center gap-2 transition hover:from-[#EFC078] hover:to-[#E0AC53]"
          >
            Feels Accurate <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-6 text-gray-400 text-sm">
        <ShieldCheck size={16} className="text-[#D9A44A]" /><span>Your results are for your eyes only.</span>
      </div>
    </section>
  );
}
