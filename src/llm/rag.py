import os
from langchain_groq import ChatGroq  
from langchain_core.messages import SystemMessage, HumanMessage
from src.reranking.cross_encoder import CrossEncoderReranker  
from src.utils.profiling import profile_section
from dotenv import load_dotenv
load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

default_llm = ChatGroq(model="llama-3.3-70b-versatile", groq_api_key=groq_api_key, temperature=0.1)
reranker = CrossEncoderReranker()

SYSTEM_PROMPT = """You are a world-class academic research assistant specializing in analyzing research papers.
Your task is to synthesize the provided context and deliver an extremely well-structured, precise, and authoritative response.

Follow these strict response formatting rules:
1. **Executive Summary**: Begin with a clear 2-3 sentence summary that directly answers the user's question.
2. **Key Details & Technical Evidence**: Present details in bullet points grouped by theme or paper. Use bold text for key concepts.
3. **Citations**: Always cite the exact source file and Document label (e.g., `[Document 1: filename.pdf]`) inline when making any claim.
4. **Context Boundaries**: If the provided documents do not contain enough information to fully answer a part of the query, explicitly state what is missing instead of guessing or hallucinating.
5. **Format**: Use clear markdown headers, bold highlights, and clean bullet lists.
"""

def rag_simple(query, retriever, llm=None, top_k=5, retrieve_k=25, min_cross_score: float = -6.0, profile: bool = True):
    if llm is None:
        llm = default_llm

    with profile_section("rag_total", enabled=profile, extra_meta={"query": query, "retrieve_k": retrieve_k, "top_k": top_k}) as total_metrics:
        raw_results = retriever.retrieve(
            query=query,
            top_k=retrieve_k,
            profile=profile
        )

        # Re-rank them using the Cross-Encoder
        reranked_results = reranker.rerank(
            query=query,
            documents=raw_results,
            top_k=top_k,
            profile=profile
        )

        if not reranked_results:
            print("[RAG Warning] No relevant documents retrieved or reranked.")
            return "No relevant documents found in the knowledge base."

        # Filter out extreme outliers if min_cross_score is set
        filtered_results = [doc for doc in reranked_results if doc.get("cross_score", 0.0) >= min_cross_score]
        if not filtered_results:
            # Fall back to top document if all were below threshold
            filtered_results = reranked_results[:1]

        top_cross_score = filtered_results[0].get("cross_score", 0.0)
        if top_cross_score < -2.0:
            print(f"[RAG Warning] Moderate/Low cross-encoder score ({top_cross_score:.2f}). Query may be distant from document topics.")

        context_docs = []
        for i, doc in enumerate(filtered_results, start=1):
            source = doc.get("metadata", {}).get("source_file", "unknown")
            sim_score = doc.get("similarity_score", 0.0)
            cross_score = doc.get("cross_score", 0.0)
            page_num = doc.get("metadata", {}).get("page", "")
            page_str = f", Page {page_num+1}" if page_num != "" else ""

            context_docs.append(
                f"[Document {i}: {source}{page_str} | Relevance Score: {cross_score:.2f}]\n"
                f"{doc['content']}"
            )
        
        context = "\n\n".join(context_docs)

        user_prompt = f"""Question:
{query}

Context Documents:
{context}

Please provide a detailed, well-structured, and cited answer based ONLY on the Context Documents above."""

        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=user_prompt)
        ]

        with profile_section("llm_generation", enabled=profile, extra_meta={"top_k_used": len(filtered_results)}) as llm_metrics:
            response = llm.invoke(messages)
            answer_content = response.content

        total_metrics["answer_length"] = len(answer_content)

    return answer_content


