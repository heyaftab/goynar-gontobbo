interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: "left" | "center";
}

export function SectionHeading({
  title,
  subtitle,
  alignment = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-8 sm:mb-12 ${
        alignment === "center" ? "text-center" : "text-left"
      }`}
    >
      <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className={`w-12 h-[1px] bg-gold mt-4 ${
          alignment === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
