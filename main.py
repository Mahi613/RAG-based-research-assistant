from src.loaders.pdf_loader import process_all_pdfs
from src.preprocessing.chunking import chunk_pdf
from src.embeddings.embedding_model import EmbeddingModel
from src.vectorstore.chroma_store import Vectorstore
from src.retrieval.retriever import RAGRetriever
from src.llm.rag import rag_simple
from arxiv_fetch import ArxivFetcher
import hashlib, os



def main():
    print("====== Research Paper Assistant ======\n")
    
    fetcher = ArxivFetcher()

    topic = input(
        "Enter paper title or research topic "
        "(Press Enter to use existing PDFs): "
    )

    if topic.strip():
        fetcher.search_and_download(
            query=topic,
            max_results=10
        )

    # Step 1: Load PDFs
    print("Loading PDFs...")
    documents = process_all_pdfs("data/pdf")

    # Step 2: Chunk documents
    print("Chunking documents...")
    chunks = chunk_pdf(documents)

    # Step 3: Generate embeddings
    print("Generating embeddings...")
    embedding_model = EmbeddingModel()

    texts = [doc.page_content for doc in chunks]
    embeddings = embedding_model.generate_embeddings(texts)

    # Step 4: Create vector database
    print("Creating vector store...")
    vectorstore = Vectorstore()
    
    def ensure_hash(docs):
        """Add a deterministic ``file_hash`` to each Document's metadata if missing.

        Parameters
        ----------
        docs : list[Document]
            List of LangChain ``Document`` objects produced by the PDF loader.
        """
        for doc in docs:
            # ``Document`` objects expose a ``metadata`` dict attribute.
            metadata = getattr(doc, "metadata", None)
            if metadata is None:
                continue
            if "file_hash" not in metadata:
                # fallback to the source filename when the original path is unavailable
                src = metadata.get("source_file", "unknown")
                metadata["file_hash"] = hashlib.sha256(src.encode()).hexdigest()
        return docs

    chunks = ensure_hash(chunks)
    vectorstore.add_documents(chunks, embeddings)


    # Step 5: Create retriever
    retriever = RAGRetriever(
        vector_store=vectorstore,
        embedding_manager=embedding_model
    )

    print("\nSystem Ready!")

    # Step 6: Chat loop
    while True:
        query = input("\nAsk a question (or type 'exit'): ")

        if query.lower() == "exit":
            print("Goodbye!")
            break

        answer = rag_simple(
            query=query,
            retriever=retriever,
            llm=None,      # remove if your rag_simple creates the LLM internally
            top_k=3
        )

        print("\nAnswer:")
        print(answer)

   
if __name__ == "__main__":
    main()