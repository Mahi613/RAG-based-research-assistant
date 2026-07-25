"use client";

import { motion } from "framer-motion";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import { MOCK_PAPERS } from "@/lib/mockData";
import { formatTimestamp, cn } from "@/lib/utils";
import { User, Bot, Info, BookMarked } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
  index: number;
}

function SkeletonLoader() {
  return (
    <div className="space-y-2 py-1" aria-label="Loading response…">
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-5/6 rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
      <div className="skeleton h-3 w-2/3 rounded" />
    </div>
  );
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isAssistant = message.role === "assistant";

  const referencedPapers = message.references
    ? MOCK_PAPERS.filter((p) => message.references!.includes(p.id))
    : [];

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="flex items-center gap-3 py-3"
        role="status"
      >
        <hr className="flex-1 border-t border-[rgba(26,26,26,0.08)]" />
        <div className="flex items-center gap-1.5">
          <Info size={9} className="text-[rgba(26,26,26,0.3)]" />
          <p className="font-mono text-[9px] text-[rgba(26,26,26,0.4)] uppercase tracking-widest">
            {message.content}
          </p>
        </div>
        <hr className="flex-1 border-t border-[rgba(26,26,26,0.08)]" />
      </motion.div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        "py-5 border-b border-[rgba(26,26,26,0.07)]",
        isUser && "bg-[rgba(74,83,67,0.025)]"
      )}
    >
      <div className="px-6">
        {/* Role header */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className={cn(
              "w-5 h-5 flex items-center justify-center border",
              isUser
                ? "border-[rgba(26,26,26,0.2)] text-[rgba(26,26,26,0.5)]"
                : "border-[#4a5343] text-[#4a5343]"
            )}
          >
            {isUser ? <User size={10} /> : <Bot size={10} />}
          </div>
          <span
            className={cn(
              "font-mono text-[9px] uppercase tracking-widest",
              isUser
                ? "text-[rgba(26,26,26,0.45)]"
                : "text-[#4a5343]"
            )}
          >
            {isUser ? "Researcher" : "Archive Intelligence"}
          </span>
          <div className="flex-1 h-px bg-[rgba(26,26,26,0.06)]" />
          <span className="font-mono text-[9px] text-[rgba(26,26,26,0.3)]">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        {/* Content */}
        {message.isLoading ? (
          <SkeletonLoader />
        ) : (
          <div
            className={cn(
              isAssistant
                ? "prose-archival"
                : "font-sans text-[13px] text-[rgba(26,26,26,0.82)] leading-relaxed"
            )}
          >
            {isAssistant ? (
              <div className="font-serif text-[15px] text-[#1a1a1a] leading-relaxed space-y-3">
                <ReactMarkdownFallback content={message.content} />
              </div>
            ) : (
              <p>{message.content}</p>
            )}
          </div>
        )}

        {/* Referenced papers */}
        {referencedPapers.length > 0 && !message.isLoading && (
          <div className="mt-4 pt-3 border-t border-[rgba(26,26,26,0.07)]">
            <div className="flex items-center gap-1.5 mb-2">
              <BookMarked size={9} className="text-[rgba(26,26,26,0.35)]" />
              <span className="font-mono text-[9px] text-[rgba(26,26,26,0.4)] uppercase tracking-widest">
                Sources cited
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {referencedPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="flex items-start gap-1.5 border border-[rgba(26,26,26,0.10)] px-2.5 py-1.5 max-w-xs"
                >
                  <span className="font-mono text-[9px] text-[#c1440e] shrink-0">
                    [{paper.crn}]
                  </span>
                  <span className="font-serif text-[11px] text-[rgba(26,26,26,0.65)] leading-snug">
                    {paper.title.split(":")[0]}
                    {paper.title.includes(":") ? "…" : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}

// Simple markdown renderer without external dependency
function ReactMarkdownFallback({ content }: { content: string }) {
  // Split by **bold** markers and newlines, render paragraphs
  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <>
      {paragraphs.map((para, i) => {
        // Process bold text
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="font-serif text-[15px] text-[#1a1a1a] leading-relaxed">
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={j} className="font-semibold text-[#1a1a1a]">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </>
  );
}
