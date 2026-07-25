import arxiv
import requests
import os


class ArxivFetcher:
    def __init__(self, save_dir="data/pdf"):
        self.save_dir = save_dir
        os.makedirs(self.save_dir, exist_ok=True)
        # arxiv v4+ requires an explicit Client to fetch results
        self.client = arxiv.Client()

    def search_and_download(self,
                            query,
                            max_results=10,
                            sort_by=arxiv.SortCriterion.Relevance):

        print(f"\nSearching arXiv for: {query}")

        search = arxiv.Search(
            query=query,
            max_results=max_results,
            sort_by=sort_by
        )

        downloaded_files = []

        # v4 API: use client.results(search) instead of search.results()
        for paper in self.client.results(search):
            print("-" * 60)
            print("Title:", paper.title)
            print("Published:", paper.published.date())
            print("Authors:", ", ".join(author.name for author in paper.authors))
            print("PDF:", paper.pdf_url)

            # Build a safe filename that includes the title (truncated & sanitized)
            safe_title = "_".join(paper.title.split())  # simple whitespace‑to‑underscore
            # Remove characters that are illegal in Windows filenames
            safe_title = "".join(c for c in safe_title if c.isalnum() or c in "_-")
            safe_title = safe_title[:50]  # limit length to keep path reasonable
            filename = f"{paper.get_short_id().replace('/', '_')}_{safe_title}.pdf"
            filepath = os.path.join(self.save_dir, filename)

            if os.path.exists(filepath):
                print("Already exists. Skipping...")
                downloaded_files.append(filepath)
                continue

            response = requests.get(paper.pdf_url)
            with open(filepath, "wb") as f:
                f.write(response.content)

            print(f"Downloaded -> {filepath}")
            downloaded_files.append(filepath)

        # Write a simple metadata index (title -> file) for later reference
        metadata_path = os.path.join(self.save_dir, "metadata.txt")
        with open(metadata_path, "w", encoding="utf-8") as meta_f:
            for fp in downloaded_files:
                title = fp.split("_")[-1].rsplit('.pdf', 1)[0]
                meta_f.write(f"{title}\t{fp}\n")



print("\n--- ArxivFetcher ---")
if __name__ == "__main__":
    print("\n--- ArxivFetcher ---")
    fetcher = ArxivFetcher()
    query = input("Enter paper title or research topic: ")
    fetcher.search_and_download(query=query, max_results=10)