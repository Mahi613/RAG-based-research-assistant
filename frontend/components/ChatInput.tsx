"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Send, CornerDownLeft, Sparkles } from "lucide-react";
import { SUGGESTED_PROMPTS } from "@/lib/mockData";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading = false }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleSuggestion = (prompt: string) => {
    onSend(prompt);
  };

  return (
    <div className="border-t border-[rgba(26,26,26,0.12)] bg-[#f7f4ef] p-4">
      {/* Quick prompts row */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1 shrink-0">
          <Sparkles size={9} className="text-[rgba(26,26,26,0.3)]" />
          <span className="font-mono text-[9px] text-[rgba(26,26,26,0.35)] uppercase tracking-widest whitespace-nowrap">
            Quick prompts
          </span>
        </div>
        {SUGGESTED_PROMPTS.slice(0, 3).map((prompt, i) => (
          <motion.button
            key={i}
            whileHover={{ backgroundColor: "rgba(74,83,67,0.08)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSuggestion(prompt)}
            disabled={isLoading}
            className="shrink-0 font-sans text-[10px] text-[rgba(26,26,26,0.5)] border border-[rgba(26,26,26,0.14)] px-2.5 py-1 hover:text-[rgba(26,26,26,0.8)] transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            {prompt.length > 42 ? prompt.slice(0, 42) + "…" : prompt}
          </motion.button>
        ))}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          animate={{
            borderColor: isFocused
              ? "rgba(74, 83, 67, 0.5)"
              : "rgba(26, 26, 26, 0.14)",
          }}
          className="border relative"
        >
          <textarea
            id="chat-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Continue your research inquiry…"
            aria-label="Research message"
            disabled={isLoading}
            rows={3}
            className="w-full resize-none bg-transparent px-4 py-3 pr-14 font-sans text-[13px] text-[#1a1a1a] placeholder:text-[rgba(26,26,26,0.28)] outline-none leading-relaxed disabled:opacity-50"
          />

          {/* Send button */}
          <AnimatePresence>
            {value.trim().length > 0 && !isLoading && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                whileHover={{ backgroundColor: "#3d4538" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                aria-label="Send message"
                className="absolute right-3 bottom-3 p-2 bg-[#4a5343] text-[#f7f4ef] transition-colors"
              >
                <Send size={12} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Loading state */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-3 bottom-3 p-2"
              >
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-3 h-3 rounded-full border border-[#4a5343] border-t-transparent"
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hint bar */}
        <div className="flex items-center justify-between mt-1.5 px-0.5">
          <p className="font-mono text-[9px] text-[rgba(26,26,26,0.3)]">
            Shift + Enter for new line
          </p>
          <div className="flex items-center gap-1">
            <CornerDownLeft size={9} className="text-[rgba(26,26,26,0.3)]" />
            <p className="font-mono text-[9px] text-[rgba(26,26,26,0.3)]">
              Enter to send
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
