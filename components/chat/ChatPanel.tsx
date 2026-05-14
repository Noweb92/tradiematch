"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCheck, Receipt, Calendar, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

export interface ChatMessage {
  id: string;
  chat_room_id: string;
  sender_id: string;
  content: string | null;
  attachment_url: string | null;
  read_at: string | null;
  message_type: "text" | "image" | "quote" | "system";
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface Props {
  roomId: string;
  selfId: string;
  initialMessages: ChatMessage[];
  otherName: string;
  otherAvatar?: string | null;
  quickActions?: React.ReactNode;
}

export function ChatPanel({
  roomId,
  selfId,
  initialMessages,
  otherName,
  otherAvatar,
  quickActions,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Subscribe to realtime inserts
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`chat:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_room_id=eq.${roomId}`,
        },
        (payload) => {
          const msg = payload.new as ChatMessage;
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages.length]);

  async function send() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setDraft("");

    const supabase = createSupabaseBrowserClient();
    // Optimistic
    const tempId = `temp-${Date.now()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      chat_room_id: roomId,
      sender_id: selfId,
      content: text,
      attachment_url: null,
      read_at: null,
      message_type: "text",
      metadata: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        chat_room_id: roomId,
        sender_id: selfId,
        content: text,
        message_type: "text",
      })
      .select()
      .single();

    setSending(false);
    if (error) {
      toast.error(error.message);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setDraft(text);
      return;
    }
    // Replace optimistic with real
    if (data) {
      const realMsg = data as ChatMessage;
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? realMsg : m)),
      );
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-navy/8 bg-white/85 backdrop-blur-xl flex items-center gap-3">
        {otherAvatar && (
          <img
            src={otherAvatar}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-navy truncate">{otherName}</div>
          <div className="text-[11px] text-navy/55 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Realtime via Supabase
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-gradient-to-b from-orange-50/30 to-white"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <Bubble key={m.id} message={m} self={m.sender_id === selfId} />
          ))}
        </AnimatePresence>
        {messages.length === 0 && (
          <div className="text-center text-xs text-navy/45 py-8">
            Say g&apos;day to get started.
          </div>
        )}
      </div>

      {/* Quick actions */}
      {quickActions && (
        <div className="px-3 pt-2.5 pb-1 border-t border-navy/8 bg-white/85 backdrop-blur-xl">
          {quickActions}
        </div>
      )}

      {/* Composer */}
      <div className="px-3 py-2.5 border-t border-navy/8 bg-white/85 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-navy/[0.04] rounded-full px-4 py-2.5">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Type a message…"
              className="flex-1 bg-transparent text-sm placeholder:text-navy/40 outline-none"
            />
          </div>
          <button
            onClick={send}
            disabled={sending || !draft.trim()}
            className="w-10 h-10 rounded-full bg-orange grid place-items-center text-white shadow-glow btn-press hover:bg-orange-600 disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ message, self }: { message: ChatMessage; self: boolean }) {
  if (message.message_type === "quote") {
    const meta = (message.metadata ?? {}) as {
      title?: string;
      amount?: number;
      valid_until?: string;
      status?: string;
    };
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex", self ? "justify-end" : "justify-start")}
      >
        <div className="max-w-[280px] rounded-2xl bg-white border border-navy/8 shadow-soft overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-orange to-orange-600 text-white flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                Quote
              </div>
              <div className="font-black text-sm leading-tight">
                {meta.title ?? "Job quote"}
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-black tracking-tight tabular-nums">
              ${meta.amount?.toLocaleString("en-US") ?? "—"}
            </div>
            <div className="text-[11px] text-navy/55 mt-1">
              {meta.valid_until
                ? `Valid until ${new Date(meta.valid_until).toLocaleDateString("en-AU")}`
                : "Awaiting customer response"}
            </div>
          </div>
          <div className="px-4 py-2 text-[10px] text-navy/40 font-medium text-right">
            {formatTime(message.created_at)}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex items-end gap-2", self && "justify-end")}
    >
      <div
        className={cn(
          "max-w-[75%] px-4 py-2.5 text-sm leading-relaxed shadow-soft",
          self
            ? "bg-orange text-white rounded-2xl rounded-br-sm"
            : "bg-white text-navy rounded-2xl rounded-bl-sm border border-navy/8",
        )}
      >
        <div>{message.content}</div>
        <div
          className={cn(
            "text-[10px] mt-0.5 font-medium flex items-center gap-1",
            self ? "text-white/70 justify-end" : "text-navy/40",
          )}
        >
          <span>{formatTime(message.created_at)}</span>
          {self && message.read_at && <CheckCheck className="w-3 h-3" />}
        </div>
      </div>
    </motion.div>
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  });
}
