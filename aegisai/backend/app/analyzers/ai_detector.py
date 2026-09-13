import os
import re
from typing import List, Dict, Any

AI_SIGNATURES = [
    ("OpenAI", [r'import\s+openai', r'from\s+openai', r'ChatOpenAI', r'OpenAIEmbeddings'], "LLM Provider"),
    ("Anthropic", [r'import\s+anthropic', r'from\s+anthropic', r'Anthropic\('], "LLM Provider"),
    ("Gemini", [r'google\.generativeai', r'GenAI', r'Gemini'], "LLM Provider"),
    ("LangChain", [r'import\s+langchain', r'from\s+langchain'], "AI Framework"),
    ("LlamaIndex", [r'import\s+llama_index', r'from\s+llama_index'], "AI Framework"),
    ("ChromaDB", [r'import\s+chromadb', r'from\s+langchain\.vectorstores\s+import\s+Chroma'], "Vector Database"),
    ("FAISS", [r'import\s+faiss', r'FAISS'], "Vector Database"),
    ("Pinecone", [r'import\s+pinecone', r'Pinecone'], "Vector Database"),
    ("Embeddings Generator", [r'OpenAIEmbeddings', r'HuggingFaceEmbeddings', r'embedding_function'], "RAG Component"),
    ("Vector Retriever", [r'similarity_search', r'as_retriever', r'vector_store'], "RAG Component"),
]

class AIDetector:
    @staticmethod
    def detect_components(root_dir: str) -> Dict[str, Any]:
        detected_tech = {}
        files_scanned = 0

        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in {".git", ".venv", "venv", "node_modules", "__pycache__"}]
            for file in files:
                if not file.endswith((".py", ".ts", ".js", ".json", ".txt")):
                    continue
                
                full_path = os.path.join(root, file)
                files_scanned += 1
                
                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                    
                    for name, patterns, category in AI_SIGNATURES:
                        for pattern in patterns:
                            if re.search(pattern, content):
                                if name not in detected_tech:
                                    detected_tech[name] = {
                                        "name": name,
                                        "category": category,
                                        "detected": True,
                                        "confidence": 0.95,
                                        "details": f"Import/pattern `{pattern}` detected in {os.path.relpath(full_path, root_dir)}"
                                    }
                                break
                except Exception:
                    pass

        # Build final components list
        components_list = list(detected_tech.values())
        
        # Mandatory return format
        return {
            "detected_components": [comp["name"] for comp in components_list],
            "details": components_list,
            "has_ai_components": len(components_list) > 0
        }
