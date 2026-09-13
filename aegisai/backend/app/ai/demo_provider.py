import re
from typing import List, Dict, Any
from app.ai.base import BaseAIProvider

class DemoProvider(BaseAIProvider):
    def analyze_findings(self, project_name: str, findings: List[Dict[str, Any]]) -> str:
        criticals = [f for f in findings if f.get("severity") == "critical"]
        highs = [f for f in findings if f.get("severity") == "high"]
        
        summary = f"### Executive Summary for {project_name}\n"
        summary += f"Static analysis identified **{len(findings)} total issue(s)** across security, reliability, performance, code quality, and RAG architectural domains.\n\n"
        
        if criticals:
            summary += f"⚠️ **Critical Priority ({len(criticals)})**: Urgent security vulnerabilities detected, including {criticals[0].get('title', 'hardcoded credentials/subprocess risks')}. Immediate remediation is strongly advised.\n"
        if highs:
            summary += f"⚡ **High Priority ({len(highs)})**: Key operational risks detected, such as missing network timeouts and unhandled broad exception blocks.\n"
            
        summary += "\n**Recommended Action Plan**:\n1. Revoke and rotate any hardcoded keys.\n2. Add timeout parameters to HTTP network calls.\n3. Configure proper chunk overlap and lower top_k in RAG vector queries."
        return summary

    def analyze_incident(self, error_text: str, project_context: Dict[str, Any] = None) -> Dict[str, Any]:
        error_lower = error_text.lower()

        # Deterministic stack trace & exception parsing
        if "connecttimeout" in error_lower or "readtimeout" in error_lower or "timeout" in error_lower:
            return {
                "classification": "Network Timeout / Remote Dependency Hang",
                "probable_root_cause": "An HTTP outbound request was initiated without a timeout specification, causing the thread to block indefinitely when the target service failed to respond.",
                "evidence": "Log snippet indicates socket timeout / urllib3 connection timeout exception.",
                "impact": "Thread pool starvation leading to cascading service latency spikes and 504 Gateway Timeouts.",
                "recommendation": "Set explicit timeouts on all HTTP client calls (e.g., `requests.get(url, timeout=(3.05, 10))`). Implement circuit breaker pattern for external APIs.",
                "confidence": 0.95,
                "limitations": "Deterministic analysis based on log keyword matching. Live remote network trace unavailable."
            }
        elif "subprocess" in error_lower or "command" in error_lower or "shell" in error_lower:
            return {
                "classification": "Security Injection / Unsafe Command Execution",
                "probable_root_cause": "Subprocess command execution passed unsanitized arguments to a system shell (`shell=True`).",
                "evidence": "Stack frame references `subprocess.check_output` or command execution.",
                "impact": "Risk of Remote Code Execution (RCE) if user input reaches shell evaluation.",
                "recommendation": "Pass arguments as an un-evaluated array list: `subprocess.run(['command', arg1, arg2], shell=False)`.",
                "confidence": 0.92,
                "limitations": "Parsed from static error traceback."
            }
        elif "chroma" in error_lower or "vector" in error_lower or "rag" in error_lower or "openai" in error_lower:
            return {
                "classification": "AI / RAG Vector Database Connection Failure",
                "probable_root_cause": "Vector store connection attempt failed due to invalid API credentials or unreachable vector DB collection.",
                "evidence": "Exception occurred during `similarity_search` or `OpenAIEmbeddings` instantiation.",
                "impact": "Customer support query pipeline fails completely, returning fallback 500 error responses.",
                "recommendation": "Validate vector database host connection, verify `OPENAI_API_KEY` validity, and implement fallback search graceful degradation.",
                "confidence": 0.90,
                "limitations": "Evaluated in Demo Mode."
            }
        elif "keyerror" in error_lower or "attributeerror" in error_lower:
            return {
                "classification": "Runtime Data Structure Null Pointer / Missing Key",
                "probable_root_cause": "Accessed missing key in dictionary or attribute on unexpected NoneType object without prior schema validation.",
                "evidence": f"Error text references missing key or attribute: {error_text[:100]}...",
                "impact": "Uncaught Python exception results in unhandled 500 Internal Server Error for client requests.",
                "recommendation": "Use Pydantic models or `.get()` dictionary accessor with fallback defaults for incoming JSON payloads.",
                "confidence": 0.88,
                "limitations": "Static log parsing."
            }
        else:
            return {
                "classification": "General Application Runtime Exception",
                "probable_root_cause": "Unhandled exception occurred during request execution path.",
                "evidence": f"Provided log trace snippet: '{error_text[:150]}...'",
                "impact": "Degraded request completion rate and elevated error rate metrics.",
                "recommendation": "Review stack frame lines in source viewer, catch expected exception types, and log structured error details.",
                "confidence": 0.75,
                "limitations": "Generic classification applied due to unspecified log signature."
            }

    def answer_project_question(self, project_context: Dict[str, Any], question: str) -> str:
        q_lower = question.lower()
        findings = project_context.get("findings", [])
        health_score = project_context.get("health_score", 100.0)
        proj_name = project_context.get("name", "Project")

        # Ground answer strictly in available findings and context
        if "health score" in q_lower or "why" in q_lower and "low" in q_lower:
            criticals = [f for f in findings if f.get("severity") == "critical"]
            highs = [f for f in findings if f.get("severity") == "high"]
            return (
                f"The overall health score for **{proj_name}** is **{health_score}/100**.\n\n"
                f"The score is reduced due to **{len(criticals)} critical** and **{len(highs)} high** severity finding(s):\n"
                + "\n".join([f"- **{f['title']}** ({f['file_path']}:L{f['line_number']})" for f in (criticals + highs)[:5]])
                + "\n\nFixing these critical security and network timeout issues will significantly restore your health score."
            )

        elif "fix first" in q_lower or "recommendation" in q_lower or "priority" in q_lower:
            top_findings = sorted(findings, key=lambda x: {"critical": 0, "high": 1, "medium": 2, "low": 3}.get(x.get("severity"), 4))
            if not top_findings:
                return f"No findings recorded for **{proj_name}**. The project health is currently clean!"
            
            top = top_findings[0]
            return (
                f"### Top Remediation Priority for {proj_name}:\n\n"
                f"**1. {top['title']}** ({top.get('severity', '').upper()})\n"
                f"- **File**: `{top.get('file_path')}` (Line {top.get('line_number')})\n"
                f"- **Root Cause**: {top.get('root_cause')}\n"
                f"- **Recommendation**: {top.get('recommendation')}\n\n"
                f"Addressing this issue first eliminates the highest risk vector in your project."
            )

        elif "security" in q_lower or "risk" in q_lower:
            sec_findings = [f for f in findings if f.get("category") == "security"]
            if not sec_findings:
                return f"No security vulnerabilities detected in **{proj_name}**."
            
            res = f"### Security Assessment for {proj_name}:\nFound **{len(sec_findings)} security issue(s)**:\n\n"
            for sf in sec_findings[:4]:
                res += f"- **{sf['title']}** (`{sf['file_path']}`:L{sf['line_number']}): {sf['description']}\n"
            res += "\nEnsure all API credentials are saved in `.env` files and never committed to source control."
            return res

        elif "rag" in q_lower or "architecture" in q_lower or "vector" in q_lower:
            rag_findings = [f for f in findings if f.get("category") == "ai_rag"]
            return (
                f"### Detected RAG Architecture & Issues for {proj_name}:\n"
                f"- **Detected Pipeline**: FastAPI -> LangChain -> ChromaDB -> ChatOpenAI\n"
                f"- **Identified Anti-Patterns ({len(rag_findings)})**:\n"
                + "\n".join([f"  * **{rf['title']}**: {rf['description']}" for rf in rag_findings])
                + "\n\n*Recommendation*: Lower `TOP_K` to 3–5 documents, add a 15% chunk overlap, and implement retrieval scoring evaluation."
            )

        else:
            # Check if information is available in project context
            if not findings:
                return f"I don't have enough evidence from the analyzed project to determine that."
            
            return (
                f"Based on the analyzed context for **{proj_name}** (Health Score: {health_score}/100):\n"
                f"- Total Analyzed Findings: {len(findings)}\n"
                f"- Primary Categories Flagged: {', '.join(set(f['category'] for f in findings))}\n\n"
                f"You can ask me specifically: *'What should I fix first?'*, *'Why is my health score low?'*, or *'What are the security risks?'*."
            )
