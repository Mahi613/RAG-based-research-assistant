import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List

class EmbeddingModel:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        self.load_model()

    def load_model(self):
        try: 
            print(f"Loading embedding model: {self.model_name}")  
            self.model = SentenceTransformer(self.model_name)
            print(f"Model loaded successfully, dimension: {self.model.get_sentence_embedding_dimension()}")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise

    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        print(f"Generating embeddings for {len(texts)} texts...")
        if not self.model:
            raise ValueError("Model not loaded")
        
        embeddings = self.model.encode(texts, show_progress_bar=True)
        print(f"Generated embeddings with shape: {embeddings.shape}")
        return embeddings
