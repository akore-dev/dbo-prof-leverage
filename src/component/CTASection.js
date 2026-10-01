import { Lock, Users, ShieldCheck } from "lucide-react";

function CTACard() {
  return (
    <div className="relative rounded-xl border border-[#D9A44A]/35 bg-[#0B121C] px-6 pb-10 pt-16 text-center md:px-16 md:pb-12">

      {/* PL circle bridging the top border */}
      <div className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-[#D9A44A] bg-[#0B121C] font-serif text-xl text-[#D9A44A]">
        PL
      </div>

      <h2 className="font-serif text-[30px] font-medium leading-tight tracking-tight text-[#F5F1E8] md:text-[42px]">
        Ready to uncover what's been hidden?
      </h2>

      <a
        href="/assessment"
        className="mt-8 inline-flex items-center gap-3 rounded-lg bg-gradient-to-b from-[#E8B563] to-[#D9A44A] px-8 py-4 text-[16px] font-semibold text-[#161005] transition duration-300 hover:from-[#EFC078] hover:to-[#E0AC53] md:text-[17px]"
      >
        Start Your Free 5-Minute Diagnostic
        <span aria-hidden="true" className="text-xl leading-none">→</span>
      </a>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
        <Lock size={14} className="text-[#D9A44A]" />
        <span>Your results are immediate.</span>
      </div>
    </div>
  );
}

function MobileTrustBlock({ Icon, title, children }) {
  return (
    <div className="flex flex-col items-center px-6 text-center">
      <Icon size={34} strokeWidth={1.4} className="text-[#D9A44A]" />
      <h3 className="mt-4 font-serif text-[16px] font-semibold tracking-[0.18em] text-[#D9A44A]">
        {title}
      </h3>
      <p className="mt-4 max-w-[320px] text-[16px] leading-[1.7] text-gray-200">
        {children}
      </p>
    </div>
  );
}

export default function CTASection() {
  return (
    <section className="w-full px-5 pb-10 pt-14 sm:px-8 md:pb-14 md:pt-20">
      <div className="mx-auto max-w-5xl">
        <CTACard />

        {/* Mobile-only trust sections */}
        <div className="mt-14 space-y-12 md:hidden">
          <MobileTrustBlock Icon={Users} title="BUILT FOR AMBITIOUS PROFESSIONALS">
            Join thousands of high-achievers who are uncovering hidden blind
            spots and unlocking their next level.
          </MobileTrustBlock>

          <div className="mx-auto h-px w-32 bg-[#D9A44A]/30" />

          <MobileTrustBlock Icon={ShieldCheck} title="PRIVATE. SECURE. RESPECTFUL.">
            Your responses are confidential and used only to generate your
            personalized results.
          </MobileTrustBlock>

          <div className="mx-auto h-px w-32 bg-[#D9A44A]/30" />

          <CTACard />
        </div>

        {/* Footer */}
        <footer className="mt-14 bg-transparent p-0 md:mt-16">
          <div className="mb-6 flex items-center justify-center gap-3 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center border border-[#D9A44A] font-serif text-lg text-[#D9A44A]">
              PL
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-[15px] font-semibold tracking-[0.18em] text-[#D9A44A]">
                <span className="text-[#EDE6D6]">PROF</span>LEVERAGE
              </span>
              <span className="mt-[2px] text-[6px] tracking-[0.28em] text-gray-400">
                CLARITY. LEVERAGE. NEXT LEVEL.
              </span>
            </div>
          </div>
         <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ProfLeverage. All rights reserved.
        </p>
        </footer>
      </div>
    </section>
  );
}
