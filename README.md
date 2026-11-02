# Research Paper Assistant (RAG Pipeline)

An intelligent Retrieval-Augmented Generation (RAG) assistant that fetches research papers from arXiv, extracts and processes PDFs, indexes semantic embeddings into ChromaDB, re-ranks relevant chunks using a Cross-Encoder model, and generates structured, cited answers using Groq LLaMA 3.3-70B.

---

## Features

- **Document Processing**: Automatic parsing of PDF research papers with PyMuPDF and Recursive Character Chunking.
- **Bi-Encoder Vector Search**: Fast dense retrieval using SentenceTransformers (`all-MiniLM-L6-v2`) and ChromaDB vector store.
- **Cross-Encoder Reranking**: High-accuracy semantic re-ranking using `cross-encoder/ms-marco-MiniLM-L-6-v2`.
- **Grounded LLM Answers**: Concise, structured responses with inline document citations (`[Document 1]`, `[Document 2]`).
- **Built-in Profiling & Logging**: Measures wall-clock execution time and RAM RSS memory footprint per stage. Logs metrics to `logs/profiling.jsonl`.
- **Automated Benchmarking**: Run evaluation test suites using `python scripts/benchmark.py`.

---

## Project Structure

```
research_ass/
├── data/
│   └── pdf/                # Downloaded PDF research papers
├── logs/                   # Profiling logs (.jsonl) and benchmark CSV reports
├── scripts/
│   └── benchmark.py        # Benchmark evaluation script
├── src/
│   ├── embeddings/         # SentenceTransformer embedding model wrappers
│   ├── llm/                # RAG prompt generation and Groq LLM orchestration
│   ├── loaders/            # PDF document parsing using PyMuPDFLoader
│   ├── preprocessing/      # Text chunking logic
│   ├── reranking/          # Cross-Encoder model re-ranking logic
│   ├── retrieval/          # ChromaDB dense retriever
│   ├── utils/              # Profiling and hashing helper utilities
│   └── vectorstore/        # ChromaDB persistent vector database
├── main.py                 # Main interactive CLI assistant loop
└── requirements.txt        # Dependencies
```

---

## Performance & Optimization Insights

Our profiling showed that re-ranking candidate passages with the Cross-Encoder is the main CPU bottleneck. By optimizing the candidate retrieval parameter (`retrieve_k=20`), we reduced latency by **37%** with zero loss in output accuracy:

| Metric | Before Optimization | After Optimization | Improvement |
| :--- | :--- | :--- | :--- |
| **Cross-Encoder Rerank Time** | ~2.28s | **~0.95s** | **~58% Faster Reranking** |
| **Average Query Latency** | 4.02s | **2.53s** | **⚡ 37% Faster Overall** |
| **Peak RAM RSS** | ~1031 MB | **~820 MB** | **~210 MB RAM Saved** |

---

## Setup & Usage

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run Interactive Assistant
```bash
python main.py
```

### 4. Run Benchmark Suite
To measure pipeline latency and memory usage on your dataset:
```bash
python scripts/benchmark.py --top_k 3
```<img width="1917" height="920" alt="Screenshot 2026-11-02 210234" src="https://github.com/user-attachments/assets/c85a7637-3426-4eb0-bc79-fe36fc4d06b1" />


Detailed reports will be generated in `logs/benchmark_<timestamp>.csv` and `logs/profiling.jsonl`.
<img width="1917" height="920" alt="Screenshot 2026-11-02 210234" src="https://github.com/user-attachments/assets/564eeeb9-c556-4b9a-8abd-4201dd3a7f48" />

