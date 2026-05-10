"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  UserPlus,
  Heart,
  Sparkles,
  MessageCircle,
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  User,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { LogoMark } from "./Logo";

const NAV = [
  { href: "/", label: "Home", icon: Home, group: "discover" },
  { href: "/onboarding", label: "Onboarding", icon: UserPlus, group: "discover" },
  { href: "/swipe", label: "Swipe", icon: Heart, group: "discover" },
  { href: "/match", label: "Matches", icon: Sparkles, group: "discover" },
  { href: "/chat", label: "Chats", icon: MessageCircle, group: "discover" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "tradie" },
  { href: "/pricing", label: "Pricing", icon: CreditCard, group: "tradie" },
  { href: "/investor", label: "Investor", icon: TrendingUp, group: "tradie" },
  { href: "/discovery", label: "Tranche 1", icon: Rocket, group: "tradie", badge: "$200K" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <div className="min-h-screen flex bg-white">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-navy/8 sticky top-0 h-screen bg-white/70 backdrop-blur-xl z-30">
        <Link href="/" className="px-6 py-6 flex items-center gap-2.5 group">
          <LogoMark size={36} className="transition-transform group-hover:rotate-12" />
          <div>
            <div className="font-black text-navy tracking-tight text-lg leading-none">
              TradieMatch
            </div>
            <div className="text-[10px] text-navy/50 font-medium tracking-wider uppercase mt-0.5">
              Demo · Pitch v3
            </div>
          </div>
        </Link>

        <nav className="px-3 flex-1 overflow-y-auto no-scrollbar pb-6">
          <SidebarGroup label="Customer">
            {NAV.filter((n) => n.group === "discover").map((item) => (
              <SidebarItem key={item.href} item={item} active={pathname === item.href} />
            ))}
          </SidebarGroup>
          <SidebarGroup label="Tradie & Investor">
            {NAV.filter((n) => n.group === "tradie").map((item) => (
              <SidebarItem key={item.href} item={item} active={pathname === item.href} />
            ))}
          </SidebarGroup>
        </nav>

        <div className="m-3 p-4 rounded-2xl bg-gradient-to-br from-navy to-navy-700 text-white relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-orange/30 blur-2xl" />
          <div className="relative">
            <div className="text-xs uppercase tracking-wider text-orange-300 font-bold mb-1">
              Live demo
            </div>
            <div className="text-sm font-semibold leading-tight">
              All screens are clickable.
            </div>
            <div className="text-xs text-white/60 mt-1.5 leading-relaxed">
              No backend — every interaction is instant.
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn("flex-1 min-w-0 pb-20 md:pb-0", isLanding && "pb-0")}>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-xl border-t border-navy/8 z-50 px-2 py-2 pb-3 safe-area-pad">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {[NAV[0], NAV[2], NAV[4], NAV[5], NAV[7]].map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 py-1.5 px-3 relative"
              >
                {active && (
                  <motion.div
                    layoutId="mobile-pill"
                    className="absolute inset-0 bg-orange/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-5 h-5 relative z-10",
                    active ? "text-orange" : "text-navy/50"
                  )}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-[10px] font-semibold relative z-10",
                    active ? "text-orange" : "text-navy/50"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function SidebarGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 first:mt-2">
      <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-navy/40 mb-1.5">
        {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SidebarItem({
  item,
  active,
}: {
  item: { href: string; label: string; icon: LucideIcon; badge?: string };
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
        active
          ? "text-navy bg-orange/10"
          : "text-navy/60 hover:text-navy hover:bg-navy/5"
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange rounded-r-full"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <Icon className={cn("w-[18px] h-[18px]", active && "text-orange")} strokeWidth={active ? 2.5 : 2} />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="px-1.5 py-0.5 rounded-md bg-orange text-white text-[9px] font-black tracking-wider tabular-nums">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
