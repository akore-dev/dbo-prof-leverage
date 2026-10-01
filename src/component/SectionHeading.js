export default function SectionHeading({ children }) {
  return (
    <div className="mb-10 flex items-center gap-5 md:mb-12 md:gap-8">
      <div className="h-px flex-1 bg-[#D9A44A]/35" />
      <h2 className="whitespace-nowrap font-serif text-[17px] font-semibold tracking-[0.22em] text-[#D9A44A] md:text-[21px]">
        {children}
      </h2>
      <div className="h-px flex-1 bg-[#D9A44A]/35" />
    </div>
  );
}
