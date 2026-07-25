import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.embeddings.embedding_model import EmbeddingModel
from src.vectorstore.chroma_store import Vectorstore
from src.retrieval.retriever import RAGRetriever
from src.llm.rag import rag_simple

print("Initializing models for quick demo...")
embedding_model = EmbeddingModel()
vectorstore = Vectorstore()
retriever = RAGRetriever(vector_store=vectorstore, embedding_manager=embedding_model)

query = "What is the Transformer architecture and how does the attention mechanism work?"
print(f"\nRunning Query: '{query}'\n")

answer = rag_simple(query=query, retriever=retriever, top_k=3, profile=False)
print("="*60)
print(answer)
print("="*60)
