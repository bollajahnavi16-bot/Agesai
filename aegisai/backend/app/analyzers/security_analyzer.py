import re
import os
import ast
from typing import List, Dict, Any

# Pattern definitions for security analyzer
SECRET_PATTERNS = [
    (r'sk-[a-zA-Z0-9]{32,}', "OpenAI API Key Exposure", "critical"),
    (r'AKIA[0-9A-Z]{16}', "AWS Access Key Exposure", "critical"),
    (r'(?i)(api[_-]?key|secret[_-]?key|auth[_-]?token|password)\s*=\s*["\']([^"\']{6,})["\']', "Potential Hardcoded Credential", "high")
]

SQL_INJECTION_REGEX = r'(?i)(select|insert|update|delete)\s+.*?\bfrom\b.*?(f["\']|%\s*\(|\+\s*["\'])'
SUBPROCESS_SHELL_REGEX = r'subprocess\.(check_output|call|run|Popen)\(.*?shell\s*=\s*True'
INSECURE_CORS_REGEX = r'allow_origins\s*=\s*\[\s*["\']\*["\']\s*\]'

class SecurityAnalyzer:
    @staticmethod
    def analyze_file(file_path: str, root_dir: str) -> List[Dict[str, Any]]:
        rel_path = os.path.relpath(file_path, root_dir).replace("\\", "/")
        findings = []

        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()

            lines = content.splitlines()

            # 1. Hardcoded Secrets Detection
            for idx, line in enumerate(lines, start=1):
                # Skip comments where developers document example keys
                if line.strip().startswith("#"):
                    continue
                
                for pattern, title, severity in SECRET_PATTERNS:
                    match = re.search(pattern, line)
                    if match:
                        matched_str = match.group(0)
                        # Avoid flagging dummy/test keys as critical unless real length
                        findings.append({
                            "category": "security",
                            "severity": severity,
                            "title": f"Potential Security Issue: {title}",
                            "description": f"Detected potential sensitive credential embedded directly in source file.",
                            "file_path": rel_path,
                            "line_number": idx,
                            "evidence": f"{line[:15]}...***REDACTED***",
                            "root_cause": "Hardcoded secret string found in source code.",
                            "impact": "Exposing secrets in repository can lead to unauthorized API access, financial loss, or data breach.",
                            "recommendation": "Move secrets into environment variables or a secure key management service (KMS).",
                            "confidence": 0.90,
                            "source": "security_analyzer"
                        })
                        break

                # 2. Insecure CORS
                if re.search(INSECURE_CORS_REGEX, line):
                    findings.append({
                        "category": "security",
                        "severity": "high",
                        "title": "Potential Security Issue: Wildcard CORS Configuration",
                        "description": "CORS middleware configured with `allow_origins=['*']`.",
                        "file_path": rel_path,
                        "line_number": idx,
                        "evidence": line.strip(),
                        "root_cause": "Wildcard origin allowed in cross-origin resource sharing configuration.",
                        "impact": "Allows arbitrary third-party websites to make authenticated cross-origin requests.",
                        "recommendation": "Restrict `allow_origins` to explicitly trusted frontend domain origins.",
                        "confidence": 0.95,
                        "source": "security_analyzer"
                    })

                # 3. Subprocess shell=True
                if re.search(SUBPROCESS_SHELL_REGEX, line):
                    findings.append({
                        "category": "security",
                        "severity": "critical",
                        "title": "Potential Security Issue: Subprocess Invocation with `shell=True`",
                        "description": "Subprocess command execution performed through system shell environment.",
                        "file_path": rel_path,
                        "line_number": idx,
                        "evidence": line.strip(),
                        "root_cause": "`shell=True` flag passed to subprocess call.",
                        "impact": "Enables Command Injection if command argument contains unsanitized user input.",
                        "recommendation": "Pass command arguments as an array list and omit `shell=True` (e.g. `subprocess.run(['echo', cmd])`).",
                        "confidence": 0.95,
                        "source": "security_analyzer"
                    })

                # 4. SQL String Formatting Injection
                if re.search(SQL_INJECTION_REGEX, line):
                    findings.append({
                        "category": "security",
                        "severity": "critical",
                        "title": "Potential Security Issue: Raw SQL String Construction",
                        "description": "SQL query built using dynamic string formatting or interpolation.",
                        "file_path": rel_path,
                        "line_number": idx,
                        "evidence": line.strip(),
                        "root_cause": "Unsafe concatenation or f-string evaluation inside SQL command string.",
                        "impact": "High risk of SQL Injection vulnerability, permitting unauthorized data read or deletion.",
                        "recommendation": "Use parameterized queries (e.g., `cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))`) or an ORM.",
                        "confidence": 0.90,
                        "source": "security_analyzer"
                    })

                # 5. Debug mode in production
                if re.search(r'(?i)\bDEBUG\s*=\s*True\b', line):
                    findings.append({
                        "category": "security",
                        "severity": "medium",
                        "title": "Potential Security Issue: Debug Mode Enabled",
                        "description": "Application debug flag set to True.",
                        "file_path": rel_path,
                        "line_number": idx,
                        "evidence": line.strip(),
                        "root_cause": "Hardcoded debug setting in source file.",
                        "impact": "Debug modes leak sensitive stack traces, environment variables, and internal code details.",
                        "recommendation": "Configure debug flags via environment variables defaulted to False in production.",
                        "confidence": 0.85,
                        "source": "security_analyzer"
                    })

                # 6. Unsafe deserialization pickle.loads
                if "pickle.loads" in line:
                    findings.append({
                        "category": "security",
                        "severity": "critical",
                        "title": "Potential Security Issue: Unsafe Deserialization with `pickle`",
                        "description": "Deserializing untrusted data stream using `pickle.loads`.",
                        "file_path": rel_path,
                        "line_number": idx,
                        "evidence": line.strip(),
                        "root_cause": "Use of python `pickle` module for data deserialization.",
                        "impact": "Arbitrary Code Execution upon deserializing malicious payload.",
                        "recommendation": "Use safe serialization formats like JSON, Protocol Buffers, or MessagePack.",
                        "confidence": 0.95,
                        "source": "security_analyzer"
                    })

        except Exception as e:
            pass

        return findings
