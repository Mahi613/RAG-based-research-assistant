import os
import sys
import time
import json
import csv
import argparse
from datetime import datetime

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.embeddings.embedding_model import EmbeddingModel
from src.vectorstore.chroma_store import Vectorstore
from src.retrieval.retriever import RAGRetriever
from src.llm.rag import rag_simple
from src.utils.profiling import get_memory_mb

DEFAULT_QUERIES = [
    "What are the primary findings of the paper?",
    "What methodology was used in the study?",
    "Summarize the main contributions and conclusions."
]

from src.loaders.pdf_loader import process_all_pdfs
from src.preprocessing.chunking import chunk_pdf
import hashlib

def run_benchmark(queries=None, top_k=3, output_csv=None):
    if queries is None:
        queries = DEFAULT_QUERIES

    print("=== Starting RAG Benchmark ===")
    print(f"Total Queries: {len(queries)}")
    print(f"Top-K Reranking: {top_k}")

    print("\nInitializing vectorstore and embedding model...")
    embedding_model = EmbeddingModel()
    vectorstore = Vectorstore()

    if vectorstore.collection.count() == 0:
        print("\n[Benchmark Setup] Vector store is empty. Ingesting documents from data/pdf...")
        documents = process_all_pdfs("data/pdf")
        if documents:
            chunks = chunk_pdf(documents)
            for doc in chunks:
                if getattr(doc, "metadata", None) and "file_hash" not in doc.metadata:
                    src = doc.metadata.get("source_file", "unknown")
                    doc.metadata["file_hash"] = hashlib.sha256(src.encode()).hexdigest()
            texts = [doc.page_content for doc in chunks]
            embeddings = embedding_model.generate_embeddings(texts)
            vectorstore.add_documents(chunks, embeddings)
            print(f"[Benchmark Setup] Ingested {len(chunks)} chunks into vector store.")

    retriever = RAGRetriever(vector_store=vectorstore, embedding_manager=embedding_model)

    results_data = []


    for i, query in enumerate(queries, 1):
        print(f"\n[{i}/{len(queries)}] Benchmark Query: '{query}'")
        
        start_mem = get_memory_mb()
        start_time = time.perf_counter()
        
        try:
            answer = rag_simple(query=query, retriever=retriever, top_k=top_k, profile=True)
            status = "SUCCESS"
        except Exception as e:
            import traceback
            traceback.print_exc()
            answer = f"ERROR: {e}"
            status = "FAILED"

        elapsed = round(time.perf_counter() - start_time, 4)
        end_mem = get_memory_mb()

        entry = {
            "query_id": i,
            "query": query,
            "status": status,
            "latency_sec": elapsed,
            "start_mem_mb": start_mem,
            "end_mem_mb": end_mem,
            "answer_length_char": len(answer),
            "timestamp": datetime.now().isoformat()
        }
        results_data.append(entry)

        print(f"  Status: {status} | Latency: {elapsed}s | Answer Chars: {len(answer)}")

    # Print summary table
    print("\n" + "="*50)
    print("BENCHMARK SUMMARY RESULTS")
    print("="*50)
    total_time = sum(r["latency_sec"] for r in results_data)
    avg_time = total_time / len(results_data) if results_data else 0
    print(f"Total Queries Processed: {len(results_data)}")
    print(f"Total Benchmark Time  : {total_time:.2f}s")
    print(f"Average Query Latency : {avg_time:.2f}s")

    if output_csv is None:
        logs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs")
        os.makedirs(logs_dir, exist_ok=True)
        timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_csv = os.path.join(logs_dir, f"benchmark_{timestamp_str}.csv")

    with open(output_csv, "w", newline="", encoding="utf-8") as f:
        fieldnames = ["query_id", "query", "status", "latency_sec", "start_mem_mb", "end_mem_mb", "answer_length_char", "timestamp"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results_data)

    print(f"\nDetailed CSV benchmark saved to: {output_csv}")
    return results_data

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run RAG pipeline benchmark")
    parser.add_argument("--top_k", type=int, default=3, help="Number of documents to rerank")
    parser.add_argument("--output", type=str, default=None, help="Output CSV path")
    args = parser.parse_args()

    run_benchmark(top_k=args.top_k, output_csv=args.output)
