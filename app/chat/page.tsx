"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  CheckCheck,
  Calendar,
  Receipt,
  CreditCard,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { TRADIES, CHATS, type Message } from "@/lib/mockData";
import { cn } from "@/lib/cn";

export default function ChatPage() {
  const [activeId, setActiveId] = useState(CHATS[0].tradieId);
  const [draft, setDraft] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  const activeChat = CHATS.find((c) => c.tradieId === activeId)!;
  const tradie = TRADIES.find((t) => t.id === activeId)!;
  const messages = activeChat.messages;

  return (
    <div className="h-[calc(100vh-0px)] md:h-screen flex bg-white overflow-hidden">
      {/* Conversations list */}
      <aside
        className={cn(
          "w-full md:w-80 border-r border-navy/8 flex flex-col bg-white",
          showMobileChat && "hidden md:flex"
        )}
      >
        <div className="px-5 py-4 border-b border-navy/8">
          <h1 className="text-2xl font-black tracking-tight">Messages</h1>
          <div className="mt-3 relative">
            <input
              placeholder="Search conversations..."
              className="w-full rounded-xl bg-navy/[0.04] px-4 py-2.5 text-sm placeholder:text-navy/40 focus:outline-none focus:bg-navy/[0.06]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {CHATS.map((c) => {
            const t = TRADIES.find((x) => x.id === c.tradieId)!;
            const last = c.messages[c.messages.length - 1];
            const active = activeId === c.tradieId;
            return (
              <button
                key={c.tradieId}
                onClick={() => {
                  setActiveId(c.tradieId);
                  setShowMobileChat(true);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-navy/[0.03] transition-colors relative",
                  active && "bg-orange/8"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="chat-active"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-orange rounded-r-full"
                  />
                )}
                <div className="relative shrink-0">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {c.lastSeen.includes("online") && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-navy text-sm truncate">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-navy/40 font-medium">
                      {last.time}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-0.5 gap-2">
                    <div className="text-xs text-navy/55 truncate">
                      {last.type === "quote"
                        ? `📋 Quote: $${last.meta?.price?.toLocaleString("en-US")}`
                        : last.type === "schedule"
                        ? `📅 ${last.meta?.date}`
                        : last.text}
                    </div>
                    {c.unread > 0 && (
                      <span className="shrink-0 min-w-[18px] h-[18px] px-1.5 rounded-full bg-orange text-white text-[10px] font-bold grid place-items-center">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Active conversation */}
      <section
        className={cn(
          "flex-1 flex flex-col min-w-0 bg-gradient-to-b from-orange-50/40 to-white",
          !showMobileChat && "hidden md:flex"
        )}
      >
        {/* Header */}
        <div className="px-4 md:px-6 py-3 border-b border-navy/8 flex items-center gap-3 bg-white/80 backdrop-blur-xl">
          <button
            className="md:hidden text-navy/70"
            onClick={() => setShowMobileChat(false)}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img
            src={tradie.photo}
            alt={tradie.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-navy">{tradie.name}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
            </div>
            <div className="text-[11px] text-navy/55 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              {activeChat.lastSeen}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <IconBtn>
              <Phone className="w-4 h-4" />
            </IconBtn>
            <IconBtn>
              <Video className="w-4 h-4" />
            </IconBtn>
            <IconBtn>
              <MoreVertical className="w-4 h-4" />
            </IconBtn>
          </div>
        </div>

        {/* Pinned tradie card */}
        <div className="mx-4 md:mx-6 mt-4 rounded-2xl bg-white border border-navy/8 p-3 flex items-center gap-3 shadow-soft">
          <img
            src={tradie.photo}
            alt=""
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-navy">
              {tradie.trade} · {tradie.suburb}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-navy/55 mt-0.5">
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-orange text-orange" />
                {tradie.rating}
              </span>
              <span>·</span>
              <span>${tradie.hourlyRate}/hr</span>
              <span>·</span>
              <span>{tradie.distanceKm}km</span>
            </div>
          </div>
          <button className="text-xs font-bold text-orange px-3 py-1.5 rounded-lg hover:bg-orange/8">
            View
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-3 no-scrollbar">
          <DateDivider label="Today" />
          {messages.map((m, i) => (
            <MessageBubble
              key={m.id}
              message={m}
              tradiePhoto={tradie.photo}
              showAvatar={
                m.from === "tradie" &&
                (i === messages.length - 1 || messages[i + 1].from !== "tradie")
              }
              index={i}
            />
          ))}
        </div>

        {/* Quick actions */}
        <div className="px-4 md:px-6 py-2.5 border-t border-navy/8 bg-white/80 backdrop-blur-xl">
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2.5">
            <QuickAction icon={<Receipt className="w-3.5 h-3.5" />}>
              Request quote
            </QuickAction>
            <QuickAction icon={<Calendar className="w-3.5 h-3.5" />}>
              Schedule visit
            </QuickAction>
            <QuickAction icon={<CreditCard className="w-3.5 h-3.5" />}>
              Pay deposit
            </QuickAction>
            <QuickAction>📷 Send photo</QuickAction>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-navy/[0.05] grid place-items-center text-navy/55 hover:bg-navy/[0.08]">
              <Paperclip className="w-4 h-4" />
            </button>
            <div className="flex-1 flex items-center gap-2 bg-navy/[0.04] rounded-full px-4 py-2.5">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm placeholder:text-navy/40 outline-none"
              />
              <button className="text-navy/40 hover:text-navy">
                <Smile className="w-4 h-4" />
              </button>
            </div>
            <button className="w-10 h-10 rounded-full bg-orange grid place-items-center text-white shadow-glow btn-press hover:bg-orange-600">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function MessageBubble({
  message,
  tradiePhoto,
  showAvatar,
  index,
}: {
  message: Message;
  tradiePhoto: string;
  showAvatar: boolean;
  index: number;
}) {
  const isMe = message.from === "customer";

  if (message.type === "quote") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        className={cn("flex", isMe ? "justify-end" : "justify-start ml-10")}
      >
        <div className="max-w-[280px] rounded-2xl bg-white border border-navy/8 shadow-soft overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-orange to-orange-600 text-white">
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
              Quote
            </div>
            <div className="font-black text-base mt-0.5">
              {message.meta?.title}
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">
                ${message.meta?.price?.toLocaleString("en-US")}
              </span>
              <span className="text-xs text-navy/50 font-medium">incl. GST</span>
            </div>
            <div className="text-[11px] text-navy/55 mt-1.5 leading-relaxed">
              Includes new unit, removal of old, full installation &amp;
              compliance certificate. Valid 7 days.
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 px-3 py-2 rounded-lg bg-success text-white text-xs font-bold btn-press">
                Accept
              </button>
              <button className="px-3 py-2 rounded-lg border border-navy/15 text-xs font-bold text-navy hover:bg-navy/[0.03]">
                Counter
              </button>
            </div>
          </div>
          <div className="px-4 py-2 text-[10px] text-navy/40 font-medium text-right">
            {message.time}
          </div>
        </div>
      </motion.div>
    );
  }

  if (message.type === "schedule") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        className={cn("flex", isMe ? "justify-end" : "justify-start ml-10")}
      >
        <div className="max-w-[260px] rounded-2xl bg-white border border-navy/8 shadow-soft p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-navy text-white grid place-items-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-navy/50">
              Booking
            </div>
            <div className="font-black text-navy text-sm">
              {message.meta?.date}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-success mt-1 font-bold">
              <CheckCheck className="w-3 h-3" />
              Confirmed
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={cn("flex items-end gap-2", isMe && "justify-end")}
    >
      {!isMe && (
        <div className="w-8 h-8 shrink-0">
          {showAvatar && (
            <img
              src={tradiePhoto}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
        </div>
      )}
      <div
        className={cn(
          "max-w-[75%] px-4 py-2.5 text-sm leading-relaxed shadow-soft",
          isMe
            ? "bg-orange text-white rounded-2xl rounded-br-sm"
            : "bg-white text-navy rounded-2xl rounded-bl-sm border border-navy/8"
        )}
      >
        <div>{message.text}</div>
        <div
          className={cn(
            "text-[10px] mt-0.5 font-medium flex items-center gap-1",
            isMe ? "text-white/70 justify-end" : "text-navy/40"
          )}
        >
          <span>{message.time}</span>
          {isMe && <CheckCheck className="w-3 h-3" />}
        </div>
      </div>
    </motion.div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="w-9 h-9 rounded-full grid place-items-center text-navy/60 hover:bg-navy/[0.05] hover:text-navy transition-colors">
      {children}
    </button>
  );
}

function QuickAction({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy/[0.05] hover:bg-navy/[0.08] text-navy text-xs font-bold transition-colors">
      {icon}
      {children}
    </button>
  );
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center my-2">
      <span className="text-[10px] font-bold uppercase tracking-wider text-navy/40 bg-white px-3 py-1 rounded-full border border-navy/8">
        {label}
      </span>
    </div>
  );
}
