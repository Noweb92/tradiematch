import { cn } from "@/lib/cn";

export function LogoMark({
  className,
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="tm-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF8E5C" />
          <stop offset="100%" stopColor="#E5471A" />
        </linearGradient>
        <linearGradient id="tm-shine" x1="20" y1="6" x2="20" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#tm-grad)" />
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#tm-shine)" />
      {/* Spark / hammer-like mark */}
      <path
        d="M20 9 L23.2 17.2 L31.5 18 L25.4 23.4 L27.2 31.6 L20 27.2 L12.8 31.6 L14.6 23.4 L8.5 18 L16.8 17.2 Z"
        fill="white"
        fillOpacity="0.95"
      />
    </svg>
  );
}

export function Logo({
  className,
  light,
  size = 36,
  showWordmark = true,
}: {
  className?: string;
  light?: boolean;
  size?: number;
  showWordmark?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {showWordmark && (
        <div>
          <div
            className={cn(
              "font-black tracking-tight leading-none",
              light ? "text-white" : "text-navy"
            )}
            style={{ fontSize: size * 0.5 }}
          >
            TradieMatch
          </div>
        </div>
      )}
    </div>
  );
}
