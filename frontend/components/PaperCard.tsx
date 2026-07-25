"use client";

import { motion } from "framer-motion";
import { FileText, TrendingUp } from "lucide-react";
import { Paper } from "@/lib/types";
import { MetadataTag } from "./MetadataTag";
import { formatCitations } from "@/lib/utils";

interface PaperCardProps {
  paper: Paper;
  rank: number;
  onClick: (id: number) => void;
}

export function PaperCard({ paper, rank, onClick }: PaperCardProps) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onClick={() => onClick(paper.id)}
      className="paper-card p-3 cursor-pointer group hover:bg-[rgba(74,83,67,0.05)] transition-colors duration-200 border border-[rgba(26,26,26,0.10)]"
      role="button"
      tabIndex={0}
      aria-label={`View paper: ${paper.title}`}
      onKeyDown={(e) => e.key === "Enter" && onClick(paper.id)}
    >
      <div className="flex items-start gap-3">
        {/* Rank */}
        <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
          <span className="font-mono text-[9px] text-[rgba(26,26,26,0.3)] leading-none">
            #{String(rank).padStart(2, "0")}
          </span>
          <div className="w-px h-8 bg-[rgba(26,26,26,0.10)]" />
          <FileText size={10} className="text-[rgba(26,26,26,0.25)]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-serif text-[13px] font-medium leading-snug text-[#1a1a1a] underline-reveal mb-1.5">
            {paper.title}
          </p>
          <p className="text-[10px] text-[rgba(26,26,26,0.45)] font-sans mb-2 truncate">
            {paper.authors.split(",")[0].trim()} et al. · {paper.year}
          </p>
          <div className="flex items-center gap-2">
            <MetadataTag label={paper.crn} variant="muted" />
            <span className="flex items-center gap-1 text-[9px] font-mono text-[rgba(26,26,26,0.4)]">
              <TrendingUp size={8} />
              {formatCitations(paper.citations)}
            </span>
          </div>
        </div>

        {/* Relevance indicator */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="font-mono text-[9px] text-[#4a5343]">
            {Math.round(paper.relevanceScore * 100)}%
          </span>
          <div
            className="w-1 rounded-full bg-[#4a5343] transition-all duration-300"
            style={{ height: `${Math.round(paper.relevanceScore * 32)}px`, opacity: 0.6 + paper.relevanceScore * 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
