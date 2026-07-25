"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ResearchLog } from "./ResearchLog";
import { ChatInput } from "./ChatInput";
import { MOCK_PAPERS, MOCK_MESSAGES } from "@/lib/mockData";
import { ChatMessage, Paper } from "@/lib/types";
import { generateId } from "@/lib/utils";

// Simulated assistant responses for new queries
const CANNED_RESPONSES: Record<string, { content: string; references: number[] }> = {
  default: {
    content:
      "Drawing from the indexed corpus, this query intersects with several threads in contemporary NLP research. The foundational literature establishes a progression from static representations toward dynamic, context-sensitive architectures capable of multi-step reasoning over retrieved knowledge.\n\nThe most salient works in your collection address this from complementary angles: the architectural substrate (Vaswani et al.), the pre-training paradigm (Devlin et al.), and the knowledge-grounding mechanism (Lewis et al.). Together they constitute a coherent lineage that informs current practice in knowledge-intensive NLP.",
    references: [1, 2, 3],
  },
};

export function Layout() {
  const [papers] = useState<Paper[]>(MOCK_PAPERS);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [selectedPaperId, setSelectedPaperId] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [activePanel, setActivePanel] = useState<"papers" | "notebook">("papers");

  const handleSearch = useCallback((query: string) => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1400);
  }, []);

  const handleSendMessage = useCallback((content: string) => {
    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsResponding(true);
    setActivePanel("notebook");

    // Simulate AI response delay
    setTimeout(() => {
      const response = CANNED_RESPONSES.default;
      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: response.content,
        timestamp: new Date().toISOString(),
        references: response.references,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsResponding(false);
    }, 2200);
  }, []);

  const handleReset = useCallback(() => {
    setMessages(MOCK_MESSAGES);
    setSelectedPaperId(null);
    setIsSearching(false);
    setIsResponding(false);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* ── Header ── */}
      <Header onReset={handleReset} />

      {/* ── Mobile Tab Bar ── */}
      <div className="md:hidden flex border-b border-[rgba(26,26,26,0.12)] shrink-0">
        {(["papers", "notebook"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActivePanel(tab)}
            aria-selected={activePanel === tab}
            role="tab"
            className={`flex-1 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              activePanel === tab
                ? "text-[#4a5343] border-b-2 border-[#4a5343]"
                : "text-[rgba(26,26,26,0.45)] border-b-2 border-transparent"
            }`}
          >
            {tab === "papers" ? "Source Documents" : "Research Log"}
          </button>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 min-h-0">
        {/* ── Left Panel: Sidebar (45%) ── */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`
            w-full md:w-[45%] lg:w-[42%] xl:w-[40%] flex-shrink-0
            ${activePanel === "papers" ? "flex" : "hidden"} md:flex
            flex-col h-full
          `}
        >
          <Sidebar
            papers={papers}
            selectedPaperId={selectedPaperId}
            onSelectPaper={setSelectedPaperId}
            onSearch={handleSearch}
            isSearching={isSearching}
          />
        </motion.div>

        {/* ── Right Panel: Research Log (55%) ── */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`
            flex-1 flex flex-col min-h-0 min-w-0
            ${activePanel === "notebook" ? "flex" : "hidden"} md:flex
          `}
          aria-label="Research notebook"
        >
          <ResearchLog messages={messages} isLoading={isResponding} />
          <ChatInput onSend={handleSendMessage} isLoading={isResponding} />
        </motion.div>
      </div>
    </div>
  );
}
