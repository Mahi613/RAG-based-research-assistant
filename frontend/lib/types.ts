// ─── Paper / Research Types ──────────────────────────────────────────────────

export interface Paper {
  id: number;
  title: string;
  authors: string;
  year: number;
  citations: number;
  abstract: string;
  crn: string;
  journal: string;
  doi: string;
  tags: string[];
  relevanceScore: number;
}

// ─── Chat / Research Log Types ───────────────────────────────────────────────

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  references?: number[]; // Paper IDs referenced
  isLoading?: boolean;
}

// ─── Search / Query Types ─────────────────────────────────────────────────────

export interface SearchQuery {
  query: string;
  filters: {
    yearFrom?: number;
    yearTo?: number;
    minCitations?: number;
    tags?: string[];
  };
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export interface PanelState {
  activePanel: "papers" | "notebook";
  searchQuery: string;
  selectedPaperId: number | null;
  isLoading: boolean;
}
