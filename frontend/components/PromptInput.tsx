"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { SUGGESTED_PROMPTS } from "@/lib/mockData";

interface PromptInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function PromptInput({ onSearch, isLoading = false }: PromptInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestion = (prompt: string) => {
    setValue(prompt);
    setShowSuggestions(false);
    onSearch(prompt);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    setShowSuggestions(isFocused && value.length === 0);
  }, [isFocused, value]);

  return (
    <div className="relative" role="search">
      <form onSubmit={handleSubmit}>
        {/* Label */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[9px] text-[rgba(26,26,26,0.4)] uppercase tracking-widest">
            Research Query
          </span>
          <div className="flex-1 h-px bg-[rgba(26,26,26,0.10)]" />
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1"
            >
              <Loader2 size={10} className="text-[#4a5343] animate-spin" />
              <span className="font-mono text-[9px] text-[#4a5343]">Searching…</span>
            </motion.div>
          )}
        </div>

        {/* Input wrapper */}
        <motion.div
          animate={{
            borderColor: isFocused
              ? "rgba(74, 83, 67, 0.6)"
              : "rgba(26, 26, 26, 0.16)",
          }}
          transition={{ duration: 0.2 }}
          className="relative flex items-center border"
          style={{ borderColor: "rgba(26,26,26,0.16)" }}
        >
          {/* Search icon */}
          <div className="absolute left-3 flex items-center pointer-events-none">
            <Search
              size={13}
              className="text-[rgba(26,26,26,0.35)]"
              aria-hidden="true"
            />
          </div>

          <input
            ref={inputRef}
            id="research-query-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 150);
            }}
            placeholder="Ask a research question…"
            aria-label="Research query"
            className="w-full bg-transparent pl-9 pr-9 py-3 font-sans text-[13px] text-[#1a1a1a] placeholder:text-[rgba(26,26,26,0.3)] outline-none"
          />

          {/* Clear button */}
          <AnimatePresence>
            {value.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-3 text-[rgba(26,26,26,0.35)] hover:text-[rgba(26,26,26,0.7)] transition-colors"
              >
                <X size={13} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit hint */}
        <div className="flex items-center justify-between mt-1.5">
          <p className="font-mono text-[9px] text-[rgba(26,26,26,0.3)]">
            {value.length > 0 ? `${value.length} chars` : "Type to begin"}
          </p>
          <p className="font-mono text-[9px] text-[rgba(26,26,26,0.3)]">
            ↵ to search
          </p>
        </div>
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-20 mt-1 bg-[#f7f4ef] border border-[rgba(26,26,26,0.14)] shadow-sm"
            role="listbox"
            aria-label="Suggested queries"
          >
            <div className="px-3 py-2 border-b border-[rgba(26,26,26,0.08)]">
              <p className="font-mono text-[9px] text-[rgba(26,26,26,0.4)] uppercase tracking-widest">
                Suggested queries
              </p>
            </div>
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <motion.button
                key={i}
                whileHover={{ backgroundColor: "rgba(74,83,67,0.06)" }}
                onClick={() => handleSuggestion(prompt)}
                role="option"
                aria-selected={false}
                className="w-full text-left px-3 py-2.5 border-b last:border-b-0 border-[rgba(26,26,26,0.06)] transition-colors"
              >
                <p className="font-sans text-[12px] text-[rgba(26,26,26,0.7)] leading-snug">
                  {prompt}
                </p>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
