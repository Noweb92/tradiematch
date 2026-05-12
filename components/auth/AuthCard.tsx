import Link from "next/link";
import { LogoMark } from "@/components/Logo";

interface Props {
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function AuthCard({ title, subtitle, footer, children }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-white flex flex-col">
      <header className="px-5 sm:px-8 py-5">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <LogoMark size={32} className="transition-transform group-hover:rotate-12" />
          <span className="font-black tracking-tight text-lg text-navy">
            TradieMatch
          </span>
        </Link>
      </header>

      <main className="flex-1 grid place-items-center px-5 py-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-navy/8 shadow-card p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-navy">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-navy/60 mt-1.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {children}
          </div>
          {footer && (
            <div className="mt-5 text-center text-sm text-navy/65">
              {footer}
            </div>
          )}
        </div>
      </main>

      <footer className="px-5 py-5 text-center text-[11px] text-navy/45">
        ©&nbsp;TradieMatch 2026 · ABN-verified marketplace · Australia
      </footer>
    </div>
  );
}
