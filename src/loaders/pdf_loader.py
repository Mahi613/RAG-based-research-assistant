import os
from pathlib import Path
from langchain_community.document_loaders import PyMuPDFLoader
from src.utils.profiling import profile_section

def process_all_pdfs(pdf_directory, profile: bool = True):
    """Process all PDF files in a directory"""
    all_documents = []
    pdf_dir = Path(pdf_directory)
    
    # Find all PDF files recursively
    pdf_files = list(pdf_dir.glob("**/*.pdf"))
    
    print(f"Found {len(pdf_files)} PDF files to process")
    
    with profile_section("process_all_pdfs", enabled=profile) as metrics:
        for pdf_file in pdf_files:
            print(f"\nProcessing: {pdf_file.name}")
            try:
                with profile_section("load_pdf_single", enabled=profile, extra_meta={"file": pdf_file.name}):
                    loader = PyMuPDFLoader(str(pdf_file))
                    documents = loader.load()
                
                # Add source information to metadata
                for doc in documents:
                    doc.metadata['source_file'] = pdf_file.name
                    doc.metadata['file_type'] = 'pdf'
                
                all_documents.extend(documents)
                print(f"  OK Loaded {len(documents)} pages")
                
            except Exception as e:
                print(f"  ERR Error: {e}")
        
        metrics["total_documents"] = len(all_documents)
        metrics["total_files"] = len(pdf_files)

    print(f"\nTotal documents loaded: {len(all_documents)}")
    return all_documents

