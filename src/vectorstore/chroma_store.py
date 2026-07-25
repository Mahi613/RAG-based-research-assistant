import os
import numpy as np
import chromadb
import uuid
from typing import List, Any

class Vectorstore:
    def __init__(self, collection_name: str = "pdf_documents", persist_directory: str = "vector_store"):
        self.collection_name = collection_name
        self.persistent_directory = persist_directory
        self.collection = None
        self.client = None
        self.initialize_store()

    def initialize_store(self):
        try:
            # Create persistent ChromaDB client
            os.makedirs(self.persistent_directory, exist_ok=True)
            self.client = chromadb.PersistentClient(path=self.persistent_directory)
            self.collection = self.client.get_or_create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"}
            )
            print(f"Vector store initialized. Collection: {self.collection_name}")
        except Exception as e:
            print(f"Error initializing vector store: {e}")
            raise

    def add_documents(self, documents: List[Any], embeddings: np.ndarray):
        # Step 1: Get the file hash from the first document (all chunks share the same hash)
        file_hash = documents[0].metadata.get("file_hash")
        if file_hash is None:
            raise ValueError("Documents do not contain 'file_hash' metadata.")

        # Step 2: Query ChromaDB to see if this hash already exists
        try:
            existing = self.collection.get(where={"file_hash": file_hash}, limit=1)
        except Exception as e:
            # If the query fails, we fall back to normal indexing to avoid silent loss
            print(f"Warning: could not query collection for existing hash ({e}); proceeding with indexing.")
            existing = {"ids": []}

        # Step 3: If a document with this hash is found, skip adding
        if len(existing.get("ids", [])) > 0:
            print("PDF already indexed. Skipping...")
            return
        
        # Continue with normal indexing logic

        if len(documents) != len(embeddings):
            raise ValueError("Number of documents must match number of embeddings")
        print(f"Adding {len(documents)} documents to vector store...")
        # Prepare data for ChromaDB
        ids = []
        metadatas = []
        documents_text = []
        embeddings_list = []
        for i, (doc, embedding) in enumerate(zip(documents, embeddings)):
            doc_id = f"doc_{uuid.uuid4().hex[:8]}_{i}"
            ids.append(doc_id)
            metadata = dict(doc.metadata)
            metadata['doc_index'] = i
            metadata['content_length'] = len(doc.page_content)
            metadatas.append(metadata)
            documents_text.append(doc.page_content)
            embeddings_list.append(embedding.tolist())
        try:
            self.collection.add(
                ids=ids,
                embeddings=embeddings_list,
                metadatas=metadatas,
                documents=documents_text
            )
            print(f"Successfully added {len(documents)} documents to vector store")
            print(f"Total documents in collection: {self.collection.count()}")
        except Exception as e:
            print(f"Error adding documents to vector store: {e}")
            raise
