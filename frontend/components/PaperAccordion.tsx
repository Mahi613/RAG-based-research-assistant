"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Quote, ExternalLink, BookOpen, Award } from "lucide-react";
import { useState } from "react";
import { Paper } from "@/lib/types";
import { MetadataTag } from "./MetadataTag";
import { formatCitations, cn } from "@/lib/utils";

interface PaperAccordionProps {
  paper: Paper;
  index: number;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export function PaperAccordion({
  paper,
  index,
  isSelected,
  onSelect,
}: PaperAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    onSelect(paper.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "paper-card border-x-0 border-b-0 border-t group",
        isSelected && "bg-[rgba(74,83,67,0.04)]"
      )}
    >
      {/* ── Accordion Trigger ── */}
      <button
        id={`paper-trigger-${paper.id}`}
        aria-expanded={isOpen}
        aria-controls={`paper-content-${paper.id}`}
        onClick={handleToggle}
        className="w-full text-left px-4 py-4 flex items-start gap-3 cursor-pointer hover:bg-[rgba(74,83,67,0.04)] transition-colors duration-200"
      >
        {/* Index number */}
        <span
          className="font-mono text-[10px] text-[rgba(26,26,26,0.35)] mt-1 shrink-0 w-5"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* CRN + year row */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[9px] text-[rgba(26,26,26,0.4)] tracking-widest uppercase">
              {paper.crn}
            </span>
            <span className="text-[rgba(26,26,26,0.2)] text-[9px]">·</span>
            <span className="font-mono text-[9px] text-[rgba(26,26,26,0.4)]">
              {paper.year}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-base font-medium leading-snug text-[#1a1a1a] underline-reveal pr-6">
            {paper.title}
          </h3>

          {/* Authors */}
          <p className="mt-1 text-[11px] text-[rgba(26,26,26,0.5)] leading-relaxed font-sans">
            {paper.authors.split(",").slice(0, 3).join(",") +
              (paper.authors.split(",").length > 3 ? " et al." : "")}
          </p>

          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {paper.tags.slice(0, 3).map((tag) => (
              <MetadataTag key={tag} label={tag} variant="muted" />
            ))}
            <MetadataTag
              label="CITED"
              value={formatCitations(paper.citations)}
              variant="accent"
            />
          </div>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="shrink-0 mt-1"
          aria-hidden="true"
        >
          <ChevronDown size={14} className="text-[rgba(26,26,26,0.4)]" />
        </motion.div>
      </button>

      {/* ── Expanded Content ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            id={`paper-content-${paper.id}`}
            role="region"
            aria-labelledby={`paper-trigger-${paper.id}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-1 ml-8">
              {/* Thin rule */}
              <hr className="separator mb-4" />

              {/* Abstract */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Quote size={11} className="text-[#4a5343]" />
                  <span className="font-mono text-[9px] text-[#4a5343] tracking-widest uppercase">
                    Abstract
                  </span>
                </div>
                <p className="text-[12.5px] leading-relaxed text-[rgba(26,26,26,0.75)] font-sans italic">
                  {paper.abstract}
                </p>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                <div>
                  <p className="font-mono text-[9px] text-[rgba(26,26,26,0.4)] uppercase tracking-widest mb-0.5">
                    Journal
                  </p>
                  <p className="text-[11px] text-[rgba(26,26,26,0.7)] font-sans leading-snug">
                    {paper.journal}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-[rgba(26,26,26,0.4)] uppercase tracking-widest mb-0.5">
                    DOI
                  </p>
                  <p className="text-[11px] text-[rgba(26,26,26,0.7)] font-mono leading-snug break-all">
                    {paper.doi}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-[rgba(26,26,26,0.4)] uppercase tracking-widest mb-0.5">
                    Relevance
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-[2px] bg-[rgba(26,26,26,0.08)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#4a5343]"
                        initial={{ width: 0 }}
                        animate={{ width: `${paper.relevanceScore * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-[rgba(26,26,26,0.5)]">
                      {Math.round(paper.relevanceScore * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-[rgba(26,26,26,0.4)] uppercase tracking-widest mb-0.5">
                    Citations
                  </p>
                  <div className="flex items-center gap-1">
                    <Award size={10} className="text-[#c1440e]" />
                    <span className="font-mono text-[11px] text-[#c1440e]">
                      {paper.citations.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#4a5343] border border-[#4a5343] px-3 py-1.5 hover:bg-[#4a5343] hover:text-[#f7f4ef] transition-colors duration-200"
                >
                  <BookOpen size={10} />
                  Add to notebook
                </motion.button>
                <motion.a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[rgba(26,26,26,0.45)] hover:text-[rgba(26,26,26,0.75)] transition-colors duration-200"
                >
                  <ExternalLink size={10} />
                  View source
                </motion.a>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
