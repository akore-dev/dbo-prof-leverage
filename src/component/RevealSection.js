import icons from "./icons.png";
import SectionHeading from "./SectionHeading";

const items = [
  {
    title: "Identity Clarity",
    text: "Do you clearly understand what makes you professionally valuable?",
    iconPosition: "0% 0%"
  },
  {
    title: "Positioning Strength",
    text: "Is your value visible, legible, and differentiated?",
    iconPosition: "100% 0%"
  },
  {
    title: "Trust Patterns",
    text: "Where does trust repeatedly form around you?",
    iconPosition: "0% 100%"
  },
  {
    title: "Hidden Leverage",
    text: "What strengths may be quietly underused or overlooked?",
    iconPosition: "100% 100%"
  }
];

export default function RevealSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-6 pt-10 sm:px-8 md:pb-10 md:pt-14">
      <SectionHeading>WHAT THIS REVEALS</SectionHeading>

      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center rounded-lg border border-white/10 bg-[#10161F] px-4 py-7 text-center md:px-7 md:py-8"
          >
            <div
              aria-hidden="true"
              className="mb-3 h-[96px] w-[144px] bg-no-repeat md:h-[136px] md:w-[204px]"
              style={{
                backgroundImage: `url(${icons})`,
                backgroundSize: "200% 200%",
                backgroundPosition: item.iconPosition
              }}
            />
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#D9A44A] md:text-[13px]">
              {item.title}
            </h3>

            <p className="mt-3 text-[14px] leading-[1.65] text-gray-400 md:text-[15px]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
