import Link from "next/link";
import {
  LayoutDashboard,
  Hammer,
  UserCheck,
  Users,
  Briefcase,
  ChartBar,
  LogOut,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";

const NAV = [
  { href: "/app/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/admin/tradies/pending", label: "Pending tradies", icon: UserCheck },
  { href: "/app/admin/tradies", label: "All tradies", icon: Hammer },
  { href: "/app/admin/users", label: "Users", icon: Users },
  { href: "/app/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/app/admin/analytics", label: "Analytics", icon: ChartBar },
];

interface Props {
  email: string;
  activePath: string;
  children: React.ReactNode;
}

export function AdminShell({ email, activePath, children }: Props) {
  return (
    <div className="min-h-screen flex bg-navy/[0.02]">
      <aside className="hidden md:flex w-64 flex-col border-r border-navy/8 sticky top-0 h-screen bg-white z-30">
        <Link href="/app/admin/dashboard" className="px-6 py-6 flex items-center gap-2.5 group">
          <LogoMark size={36} className="transition-transform group-hover:rotate-12" />
          <div>
            <div className="font-black text-navy tracking-tight text-lg leading-none">
              TradieMatch
            </div>
            <div className="text-[10px] text-orange font-bold tracking-wider uppercase mt-0.5">
              Admin console
            </div>
          </div>
        </Link>

        <nav className="px-3 flex-1 space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = activePath === item.href || activePath.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "text-navy bg-orange/10"
                    : "text-navy/60 hover:text-navy hover:bg-navy/5"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange rounded-r-full" />
                )}
                <Icon
                  className={`w-[18px] h-[18px] ${active ? "text-orange" : ""}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3">
          <div className="rounded-xl bg-navy/[0.04] p-3 mb-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-navy/45">
              Signed in as
            </div>
            <div className="text-xs font-bold text-navy truncate mt-0.5">{email}</div>
          </div>
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-navy hover:bg-navy-700 text-white text-xs font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 min-w-0 pb-12">{children}</main>
    </div>
  );
}
