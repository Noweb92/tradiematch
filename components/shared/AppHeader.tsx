import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { LogOut } from "lucide-react";

interface Props {
  email: string;
  firstName: string | null;
  homeHref?: string;
  rightSlot?: React.ReactNode;
}

export function AppHeader({ email, firstName, homeHref = "/", rightSlot }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-navy/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href={homeHref} className="inline-flex items-center gap-2.5 group">
          <LogoMark size={32} className="transition-transform group-hover:rotate-12" />
          <span className="font-black tracking-tight text-base sm:text-lg text-navy hidden sm:inline">
            TradieMatch
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {rightSlot}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <div className="text-right leading-tight">
              <div className="font-bold text-navy">{firstName ?? "Account"}</div>
              <div className="text-[10px] text-navy/50">{email}</div>
            </div>
          </div>
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="w-9 h-9 rounded-full grid place-items-center text-navy/60 hover:bg-navy/[0.05] hover:text-navy transition-colors"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
