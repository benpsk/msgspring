import Image from "next/image";
import { landingCopy } from "../../_data/landing-content";

export function LandingWordmark({
  className,
}: {
  className?: string;
}) {
  return (
    <Image
      src="/images/landing/sport-news.png"
      alt="Sport News"
      width={152}
      height={48}
      priority
      className={className}
    />
  );
}

export function CategoryLabelCard({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-[6px] bg-[#ebeef3] ${className}`}
    >
      <p className="whitespace-pre-line text-center text-[37px] leading-[39px] font-extrabold uppercase text-[#262626]">
        {label}
      </p>
    </div>
  );
}

export function CategoryImageCard({
  alt,
  className,
  imageClassName,
  sizes,
  src,
}: {
  alt: string;
  className: string;
  imageClassName?: string;
  sizes?: string;
  src: string;
}) {
  return (
    <div className={`overflow-hidden rounded-[6px] ${className}`}>
      <div className="relative h-full w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "100vw"}
          className={imageClassName ?? ""}
        />
      </div>
    </div>
  );
}

export function CategoryTableTennisCard({
  className,
  sizes,
}: {
  className: string;
  sizes: string;
}) {
  return (
    <div className={`overflow-hidden rounded-[6px] bg-[#010101] ${className}`}>
      <div className="relative h-full w-full">
        <div className="absolute left-0 top-[46px] h-[198px] w-full">
          <Image
            src="/images/landing/category-table-tennis.png"
            alt="Table tennis paddle with a ball balanced above it."
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export function RequestDemoIntro({
  bodyClassName,
  className,
  headingClassName,
}: {
  bodyClassName?: string;
  className?: string;
  headingClassName: string;
}) {
  return (
    <div className={className}>
      <div className="inline-flex items-center gap-[8px] rounded-full bg-[rgba(123,101,102,0.1)] px-[16px] py-[8px]">
        <SparkleIcon className="h-[16px] w-[16px] text-[#262626]" />
        <span className="font-[family:var(--font-figtree)] text-[14px] leading-[20px] font-semibold text-[#262626]">
          {landingCopy.requestDemoBadge}
        </span>
      </div>

      <h2 className={headingClassName}>{landingCopy.requestDemoTitle}</h2>

      <p
        className={`mt-[24px] text-center text-[20px] leading-[28px] text-[#78716d] ${bodyClassName ?? ""}`}
      >
        {landingCopy.requestDemoBody}
      </p>
    </div>
  );
}

export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M8 1.5L9.3 5.1L12.9 6.4L9.3 7.7L8 11.3L6.7 7.7L3.1 6.4L6.7 5.1L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M3.2 10.7L3.8 12.4L5.5 13L3.8 13.6L3.2 15.3L2.6 13.6L0.9 13L2.6 12.4L3.2 10.7Z"
        fill="currentColor"
      />
    </svg>
  );
}
