"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessage } from "./ChatMessage";
import { Scroll } from "lucide-react";

interface ResearchLogProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
}

export function ResearchLog({ messages, isLoading = false }: ResearchLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      className="flex-1 overflow-y-auto"
      role="log"
      aria-label="Research notebook"
      aria-live="polite"
    >
      {/* Notebook header */}
      <div className="sticky top-0 z-10 bg-[#f7f4ef] border-b border-[rgba(26,26,26,0.10)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scroll size={11} className="text-[rgba(26,26,26,0.4)]" />
          <span className="font-serif text-sm font-medium text-[rgba(26,26,26,0.65)] italic">
            Research Notebook
          </span>
          <span className="text-[rgba(26,26,26,0.2)] text-[9px]">·</span>
          <span className="font-mono text-[9px] text-[rgba(26,26,26,0.35)]">
            {messages.filter((m) => m.role !== "system").length} entries
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 border border-[rgba(26,26,26,0.2)]" />
          <div className="w-2 h-2 border border-[rgba(26,26,26,0.2)] bg-[rgba(26,26,26,0.05)]" />
        </div>
      </div>

      {/* Messages */}
      <div className="pb-4">
        {messages.map((message, index) => (
          <ChatMessage key={message.id} message={message} index={index} />
        ))}

        {/* Loading skeleton entry */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-5 border-b border-[rgba(26,26,26,0.07)]"
          >
            <div className="px-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 border border-[#4a5343] flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#4a5343] rounded-full" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#4a5343]">
                  Archive Intelligence
                </span>
                <div className="flex-1 h-px bg-[rgba(26,26,26,0.06)]" />
                <div className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                      className="w-1 h-1 rounded-full bg-[#4a5343]"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-5/6" />
                <div className="skeleton h-3 w-4/5" />
                <div className="skeleton h-3 w-3/5" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </div>
  );
}
