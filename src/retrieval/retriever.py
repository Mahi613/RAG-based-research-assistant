from typing import List, Dict, Any
from src.vectorstore.chroma_store import Vectorstore
from src.embeddings.embedding_model import EmbeddingModel
from src.utils.profiling import profile_section

class RAGRetriever:
    """
    Retrieves the most relevant document chunks
    from the ChromaDB vector store.
    """

    def __init__(self, vector_store: Vectorstore, embedding_manager: EmbeddingModel):
        """
        Parameters
        ----------
        vector_store : Your Vectorstore object
        embedding_manager : Your EmbeddingModel object
        """
        self.vector_store = vector_store
        self.embedding_manager = embedding_manager

    def retrieve(
        self,
        query: str,
        top_k: int = 50,
        score_threshold: float = 0.0,
        profile: bool = True
    ) -> List[Dict[str, Any]]:

        print(f"\nSearching for: {query}")

        with profile_section("retriever_retrieve", enabled=profile, extra_meta={"query": query, "top_k": top_k}) as metrics:
            # -----------------------------
            # Step 1 : Convert query to embedding
            # -----------------------------
            with profile_section("query_embedding", enabled=profile):
                query_embedding = self.embedding_manager.generate_embeddings([query])[0]

            total_count = self.vector_store.collection.count()
            if total_count == 0:
                print("Vector store is empty. No documents to search.")
                metrics["retrieved_count"] = 0
                return []

            effective_k = min(top_k, total_count)

            # -----------------------------
            # Step 2 : Search ChromaDB
            # -----------------------------
            with profile_section("chroma_search", enabled=profile):
                results = self.vector_store.collection.query(
                    query_embeddings=[query_embedding.tolist()],
                    n_results=effective_k
                )

            num_found = len(results["documents"][0]) if (results.get("documents") and results["documents"][0]) else 0
            print(f"ChromaDB returned {num_found} raw candidate chunks.")

            retrieved_docs = []

            # -----------------------------
            # Step 3 : Check if results exist
            # -----------------------------
            if results["documents"] and results["documents"][0]:

                documents = results["documents"][0]
                metadatas = results["metadatas"][0]
                distances = results["distances"][0]
                ids = results["ids"][0]

                # -----------------------------
                # Step 4 : Process every result
                # -----------------------------
                for rank, (doc_id,
                           document,
                           metadata,
                           distance) in enumerate(
                               zip(ids,
                                   documents,
                                   metadatas,
                                   distances),
                               start=1):

                    similarity = 1 - distance

                    if similarity >= score_threshold:

                        retrieved_docs.append({
                            "id": doc_id,
                            "content": document,
                            "metadata": metadata,
                            "distance": distance,
                            "similarity_score": similarity,
                            "rank": rank
                        })

            metrics["retrieved_count"] = len(retrieved_docs)

        print(f"Retrieved {len(retrieved_docs)} documents")

        return retrieved_docs