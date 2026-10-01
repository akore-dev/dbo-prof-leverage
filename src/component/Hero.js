export default function Hero() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-4 pt-7 sm:px-8 md:pb-8">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">

        <div className="max-w-2xl lg:pt-8">
          {/* Hero Text */}
          <h1 className="font-serif text-[40px] font-medium leading-[1.02] tracking-[-0.01em] text-[#F5F1E8] md:text-[56px] lg:text-[62px]">
            You may be carrying
            <br className="hidden md:block" />
            {" "}more <span className="text-[#D9A44A]">value</span> than your
            <br className="hidden md:block" />
            {" "}career currently reflects.
          </h1>

          <p className="mt-7 max-w-xl text-[17px] leading-[1.75] text-gray-400 md:text-[18px]">
            The Professional Leverage Blind Spot Diagnostic™ helps
            experienced professionals uncover hidden gaps in clarity,
            positioning, trust, and leverage — in just 5 minutes.
          </p>

          {/* CTA Button */}
          <a
            href="/assessment"
            className="mt-9 inline-flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-gradient-to-b from-[#E8B563] to-[#D9A44A] px-6 py-4 text-[15px] font-semibold text-[#161005] transition duration-300 hover:from-[#EFC078] hover:to-[#E0AC53] sm:w-auto md:px-8 md:text-[17px]"
          >
            Start Your Free 5-Minute Diagnostic
            <span aria-hidden="true" className="text-xl leading-none">→</span>
          </a>

          {/* Footer Note */}
          <div className="mt-8 flex max-w-lg items-start gap-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              className="mt-[2px] shrink-0"
            >
              <path
                d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
                stroke="#D9A44A"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M12 7V17L17 12H14V9L12 7Z" fill="#D9A44A" opacity="0.9" />
              <path d="M12 17V12L7 9V14L12 17Z" fill="#D9A44A" opacity="0.6" />
            </svg>

            <p className="text-[15px] leading-[1.7] md:text-[16px]">
              Used by ambitious professionals navigating growth,
              transition, and next-level decisions.
            </p>
          </div>
        </div>

        <div className="relative h-full w-full lg:-translate-y-2">
          <img
            src={require('./side.png')}
            alt="Your Professional Pattern preview card"
            className="h-full w-full rounded-xl object-contain"
          />
        </div>

      </div>
    </section>
  );
}
