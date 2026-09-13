import os
import re
from typing import List, Dict, Any

class RAGAnalyzer:
    @staticmethod
    def analyze_project(root_dir: str) -> List[Dict[str, Any]]:
        findings = []

        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in {".git", ".venv", "venv", "node_modules", "__pycache__"}]
            for file in files:
                if not file.endswith(".py"):
                    continue

                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, root_dir).replace("\\", "/")

                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()

                    lines = content.splitlines()

                    # 1. Chunk Size & Overlap Analysis
                    chunk_size_match = re.search(r'CHUNK_SIZE\s*=\s*(\d+)|chunk_size\s*=\s*(\d+)', content)
                    chunk_overlap_match = re.search(r'CHUNK_OVERLAP\s*=\s*(\d+)|chunk_overlap\s*=\s*(\d+)', content)

                    if chunk_size_match:
                        size_val = int(chunk_size_match.group(1) or chunk_size_match.group(2))
                        if size_val > 2000:
                            findings.append({
                                "category": "ai_rag",
                                "severity": "high",
                                "title": f"Oversized RAG Chunk Size ({size_val} characters)",
                                "description": f"Document chunk size set to {size_val}, exceeding recommended boundary (<2000 chars).",
                                "file_path": rel_path,
                                "line_number": 1,
                                "evidence": chunk_size_match.group(0),
                                "root_cause": "Excessive chunk size parameter configured in text splitter.",
                                "impact": "Large chunks dilute embedding semantics, reduce retrieval relevance, and exhaust LLM context windows.",
                                "recommendation": "Reduce chunk size to 500-1500 characters and introduce chunk overlap.",
                                "confidence": 0.95,
                                "source": "rag_analyzer"
                            })

                    if chunk_overlap_match:
                        overlap_val = int(chunk_overlap_match.group(1) or chunk_overlap_match.group(2))
                        if overlap_val == 0:
                            findings.append({
                                "category": "ai_rag",
                                "severity": "high",
                                "title": "Missing Chunk Overlap (chunk_overlap = 0)",
                                "description": "Document text splitting configured without chunk overlap.",
                                "file_path": rel_path,
                                "line_number": 1,
                                "evidence": chunk_overlap_match.group(0),
                                "root_cause": "Zero chunk overlap in document indexing pipeline.",
                                "impact": "Context boundary truncation: critical entities split across adjacent chunks are lost during retrieval.",
                                "recommendation": "Configure 10-20% chunk overlap (e.g., chunk_overlap=150-200).",
                                "confidence": 0.95,
                                "source": "rag_analyzer"
                            })

                    # 2. Excessive Top-K Retrieval
                    top_k_match = re.search(r'TOP_K\s*=\s*(\d+)|k\s*=\s*(\d+)', content)
                    if top_k_match:
                        k_val = int(top_k_match.group(1) or top_k_match.group(2))
                        if k_val > 10:
                            findings.append({
                                "category": "ai_rag",
                                "severity": "medium",
                                "title": f"Excessive RAG Retrieval Top-K ({k_val} documents)",
                                "description": f"Vector retrieval requests top {k_val} documents per query.",
                                "file_path": rel_path,
                                "line_number": 1,
                                "evidence": top_k_match.group(0),
                                "root_cause": "High top_k retrieval parameter configured.",
                                "impact": "Increases prompt token costs, increases LLM inference latency, and introduces prompt distraction ('lost in the middle').",
                                "recommendation": "Lower top_k to 3-5 documents and consider applying a re-ranker (e.g. Cohere / Rerank).",
                                "confidence": 0.90,
                                "source": "rag_analyzer"
                            })

                    # 3. Vector Search missing Metadata Filtering or score threshold
                    if "similarity_search" in content or "as_retriever" in content:
                        if "filter" not in content and "where" not in content:
                            findings.append({
                                "category": "ai_rag",
                                "severity": "medium",
                                "title": "Unfiltered Vector Retrieval",
                                "description": "Vector database similarity search executed without metadata scope filtering.",
                                "file_path": rel_path,
                                "line_number": 1,
                                "evidence": "similarity_search(...) without filter kwarg",
                                "root_cause": "Global vector search without tenant/user or topic metadata filtering.",
                                "impact": "Risk of cross-tenant data leakage or retrieving outdated/irrelevant document categories.",
                                "recommendation": "Apply explicit metadata filtering (e.g. `filter={'tenant_id': tenant_id}`).",
                                "confidence": 0.85,
                                "source": "rag_analyzer"
                            })

                    # 4. Absence of RAG Retrieval Evaluation Framework
                    if ("ChatOpenAI" in content or "similarity_search" in content) and "ragas" not in content and "eval" not in content:
                        findings.append({
                            "category": "ai_rag",
                            "severity": "low",
                            "title": "Missing Automated Retrieval Evaluation Pipeline",
                            "description": "RAG architecture detected without automated evaluation (Ragas / TruLens / Hit@K metrics).",
                            "file_path": rel_path,
                            "line_number": 1,
                            "evidence": "RAG pipeline present without retrieval evaluation suite.",
                            "root_cause": "No continuous evaluation metric logged for vector retrieval accuracy or hallucination rate.",
                            "impact": "Inability to detect retrieval degradation, context hallucination, or chunk quality regression over time.",
                            "recommendation": "Integrate offline test set evaluation using Ragas or RAG-Checker.",
                            "confidence": 0.80,
                            "source": "rag_analyzer"
                            })

                except Exception:
                    pass

        return findings
