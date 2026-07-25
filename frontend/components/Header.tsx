"use client";

import { motion } from "framer-motion";
import { Archive, Cpu, RefreshCw } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
  return (
    <header
      role="banner"
      className="h-12 border-b border-[rgba(26,26,26,0.12)] flex items-center justify-between px-6 shrink-0 bg-[#f7f4ef] relative z-10"
    >
      {/* Left: Wordmark */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center gap-1.5 border border-[rgba(26,26,26,0.22)] px-2 py-1">
          <Archive size={11} className="text-[#4a5343]" />
          <span className="font-mono text-[9px] text-[rgba(26,26,26,0.55)] uppercase tracking-widest">
            Archive
          </span>
        </div>
        <div className="h-4 w-px bg-[rgba(26,26,26,0.12)]" />
        <h1 className="font-serif text-lg font-medium text-[#1a1a1a] leading-none">
          The Research Dossier
        </h1>
      </motion.div>

      {/* Centre: Status indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
        aria-live="polite"
      >
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[#4a5343]"
            aria-hidden="true"
          />
          <span className="font-mono text-[9px] text-[rgba(26,26,26,0.45)] uppercase tracking-widest">
            Session Active
          </span>
        </div>
        <span className="text-[rgba(26,26,26,0.2)] text-[9px]">·</span>
        <span className="font-mono text-[9px] text-[rgba(26,26,26,0.35)]">
          5 papers indexed
        </span>
      </motion.div>

      {/* Right: Actions */}
      <motion.div
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center gap-1.5">
          <Cpu size={10} className="text-[rgba(26,26,26,0.35)]" />
          <span className="font-mono text-[9px] text-[rgba(26,26,26,0.4)] hidden sm:block">
            GPT-4o
          </span>
        </div>
        <div className="h-4 w-px bg-[rgba(26,26,26,0.12)]" />
        <motion.button
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onClick={onReset}
          aria-label="Reset session"
          className="p-1.5 text-[rgba(26,26,26,0.35)] hover:text-[rgba(26,26,26,0.65)] transition-colors"
        >
          <RefreshCw size={12} />
        </motion.button>
      </motion.div>
    </header>
  );
}
