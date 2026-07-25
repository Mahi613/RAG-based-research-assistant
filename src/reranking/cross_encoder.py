from typing import List, Dict, Any
from sentence_transformers import CrossEncoder
from src.utils.profiling import profile_section


class CrossEncoderReranker:
    """
    Re-ranks documents retrieved by the Bi-Encoder
    using a Cross-Encoder model.
    """

    def __init__(
        self,
        model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"
    ) -> None:
        """
        Initialize the Cross-Encoder model.
        """
        print(f"Loading CrossEncoder model: {model_name}")

        self.model = CrossEncoder(model_name)

        print("CrossEncoder loaded successfully.")

    def rerank(
        self,
        query: str,
        documents: List[Dict[str, Any]],
        top_k: int = 5,
        profile: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Re-rank retrieved documents based on semantic relevance.

        Parameters
        ----------
        query : str
            User query.

        documents : List[Dict[str, Any]]
            Documents returned by the bi-encoder retriever.

        top_k : int
            Number of top documents to return.

        profile : bool
            Whether profiling is enabled.

        Returns
        -------
        List[Dict[str, Any]]
            Top-k reranked documents.
        """

        # Nothing to rerank
        if not documents:
            print("No documents available for reranking.")
            return []

        print(f"Reranking {len(documents)} retrieved documents...")

        with profile_section("cross_encoder_rerank", enabled=profile, extra_meta={"input_count": len(documents), "top_k": top_k}) as metrics:
            # -----------------------------------------
            # Step 1: Build (query, document) pairs
            # -----------------------------------------
            sentence_pairs = [
                (query, document["content"])
                for document in documents
            ]

            # -----------------------------------------
            # Step 2: Predict relevance scores
            # -----------------------------------------
            scores = self.model.predict(sentence_pairs)

            # -----------------------------------------
            # Step 3: Attach CrossEncoder score
            # -----------------------------------------
            for document, score in zip(documents, scores):
                document["cross_score"] = float(score)

            # -----------------------------------------
            # Step 4: Sort by CrossEncoder score
            # -----------------------------------------
            reranked_documents = sorted(
                documents,
                key=lambda document: document["cross_score"],
                reverse=True
            )

            if reranked_documents:
                top_scores = [d["cross_score"] for d in reranked_documents[:top_k]]
                metrics["avg_top_score"] = round(sum(top_scores) / len(top_scores), 4)

        print(f"Returning top {min(top_k, len(reranked_documents))} documents.")

        # -----------------------------------------
        # Step 5: Return Top-K
        # -----------------------------------------
        return reranked_documents[:top_k]