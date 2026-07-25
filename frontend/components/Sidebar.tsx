"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FolderOpen, SlidersHorizontal, Filter, ChevronDown } from "lucide-react";
import { Paper } from "@/lib/types";
import { PromptInput } from "./PromptInput";
import { PaperAccordion } from "./PaperAccordion";

interface SidebarProps {
  papers: Paper[];
  selectedPaperId: number | null;
  onSelectPaper: (id: number) => void;
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function Sidebar({
  papers,
  selectedPaperId,
  onSelectPaper,
  onSearch,
  isSearching,
}: SidebarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"relevance" | "citations" | "year">(
    "relevance"
  );

  const sortedPapers = [...papers].sort((a, b) => {
    if (sortBy === "citations") return b.citations - a.citations;
    if (sortBy === "year") return b.year - a.year;
    return b.relevanceScore - a.relevanceScore;
  });

  return (
    <aside
      className="flex flex-col h-full border-r border-[rgba(26,26,26,0.12)] overflow-hidden"
      aria-label="Research papers panel"
    >
      {/* ── Panel Header ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="px-4 pt-5 pb-4 border-b border-[rgba(26,26,26,0.10)] shrink-0"
      >
        {/* Title row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderOpen size={13} className="text-[#4a5343]" />
            <span className="font-serif text-base font-medium text-[#1a1a1a]">
              Source Documents
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-[rgba(26,26,26,0.4)] border border-[rgba(26,26,26,0.14)] px-1.5 py-0.5">
              {papers.length} results
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              aria-label="Toggle filters"
              className="p-1.5 text-[rgba(26,26,26,0.4)] hover:text-[rgba(26,26,26,0.7)] transition-colors border border-transparent hover:border-[rgba(26,26,26,0.14)]"
            >
              <SlidersHorizontal size={12} />
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <PromptInput onSearch={onSearch} isLoading={isSearching} />

        {/* Filter bar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden mt-3"
            >
              <div className="pt-3 border-t border-[rgba(26,26,26,0.08)]">
                <div className="flex items-center gap-1.5 mb-2">
                  <Filter size={9} className="text-[rgba(26,26,26,0.35)]" />
                  <span className="font-mono text-[9px] text-[rgba(26,26,26,0.4)] uppercase tracking-widest">
                    Sort by
                  </span>
                </div>
                <div className="flex gap-2">
                  {(["relevance", "citations", "year"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSortBy(opt)}
                      aria-pressed={sortBy === opt}
                      className={`font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 border transition-colors ${
                        sortBy === opt
                          ? "border-[#4a5343] text-[#4a5343] bg-[rgba(74,83,67,0.06)]"
                          : "border-[rgba(26,26,26,0.14)] text-[rgba(26,26,26,0.45)] hover:border-[rgba(26,26,26,0.25)]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Section Label ── */}
      <div className="px-4 py-2.5 border-b border-[rgba(26,26,26,0.08)] flex items-center justify-between shrink-0 bg-[rgba(26,26,26,0.015)]">
        <span className="font-mono text-[9px] text-[rgba(26,26,26,0.4)] uppercase tracking-widest">
          Archival Records
        </span>
        <div className="flex items-center gap-1 text-[rgba(26,26,26,0.3)]">
          <ChevronDown size={9} />
          <span className="font-mono text-[9px]">Expand all</span>
        </div>
      </div>

      {/* ── Paper List ── */}
      <div className="flex-1 overflow-y-auto" role="list" aria-label="Research papers">
        {isSearching ? (
          // Skeleton loading state
          <div className="divide-y divide-[rgba(26,26,26,0.07)]">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="skeleton h-2.5 w-5 mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-2 w-20" />
                    <div className="skeleton h-3.5 w-full" />
                    <div className="skeleton h-3 w-4/5" />
                    <div className="flex gap-2 mt-1">
                      <div className="skeleton h-4 w-16" />
                      <div className="skeleton h-4 w-20" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div role="list">
            {sortedPapers.map((paper, index) => (
              <div key={paper.id} role="listitem">
                <PaperAccordion
                  paper={paper}
                  index={index}
                  isSelected={selectedPaperId === paper.id}
                  onSelect={onSelectPaper}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-[rgba(26,26,26,0.10)] px-4 py-2.5 shrink-0 flex items-center justify-between">
        <span className="font-mono text-[9px] text-[rgba(26,26,26,0.35)]">
          Sorted by {sortBy}
        </span>
        <span className="font-mono text-[9px] text-[rgba(26,26,26,0.35)]">
          Vol. I · 2026
        </span>
      </div>
    </aside>
  );
}
