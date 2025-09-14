import os, json
from pypdf import PdfReader

def extract_text(pdf_path: str):
    reader = PdfReader(pdf_path)
    pages = []
    for i, p in enumerate(reader.pages):
        pages.append({ "page": i+1, "text": p.extract_text() or "" })
    return pages

def handler(event, context=None):
    # event: { "s3Key": "...", "localPath": "services/ingest/sample.pdf" }
    pdf = event.get("localPath")
    data = extract_text(pdf)
    return { "pages": data, "status": "OK" }

if __name__ == "__main__":
    print(handler({ "localPath": "sample.pdf" }))
