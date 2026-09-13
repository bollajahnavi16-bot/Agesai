import ast
import os
import uuid
from typing import List, Dict, Any

class PythonASTVisitor(ast.NodeVisitor):
    def __init__(self, filename: str, file_content: str):
        self.filename = filename
        self.lines = file_content.splitlines()
        self.findings = []
        self.imports = set()
        self.used_names = set()

    def visit_Import(self, node: ast.Import):
        for alias in node.names:
            name = alias.asname or alias.name
            self.imports.add((name, node.lineno))
        self.generic_visit(node)

    def visit_ImportFrom(self, node: ast.ImportFrom):
        for alias in node.names:
            name = alias.asname or alias.name
            self.imports.add((name, node.lineno))
        self.generic_visit(node)

    def visit_Name(self, node: ast.Name):
        if isinstance(node.ctx, ast.Load):
            self.used_names.add(node.id)
        self.generic_visit(node)

    def visit_ExceptHandler(self, node: ast.ExceptHandler):
        line_no = node.lineno
        line_content = self.lines[line_no - 1].strip() if line_no <= len(self.lines) else ""
        
        if node.type is None:
            self.findings.append({
                "category": "reliability",
                "severity": "high",
                "title": "Bare Exception Clause",
                "description": "Catching bare exceptions suppresses all errors including SystemExit and KeyboardInterrupt.",
                "file_path": self.filename,
                "line_number": line_no,
                "evidence": line_content,
                "root_cause": "Unqualified `except:` clause used in error handling.",
                "impact": "Can hide critical system failures and unexpected bugs, making debugging extremely difficult.",
                "recommendation": "Catch specific exception types (e.g. `except ValueError:`) or handle expected exceptions explicitly.",
                "confidence": 0.95,
                "source": "python_ast"
            })
        elif isinstance(node.type, ast.Name) and node.type.id == "Exception":
            self.findings.append({
                "category": "reliability",
                "severity": "medium",
                "title": "Broad Exception Clause",
                "description": "Catching `Exception` catches all standard exceptions and may swallow unexpected failures.",
                "file_path": self.filename,
                "line_number": line_no,
                "evidence": line_content,
                "root_cause": "Broad `except Exception:` clause used.",
                "impact": "May swallow operational or programming exceptions, preventing proper error propagation.",
                "recommendation": "Refactor error handling to target narrow exception types.",
                "confidence": 0.90,
                "source": "python_ast"
            })
        self.generic_visit(node)

    def visit_Call(self, node: ast.Call):
        line_no = node.lineno
        line_content = self.lines[line_no - 1].strip() if line_no <= len(self.lines) else ""

        # Check for requests without timeout
        if isinstance(node.func, ast.Attribute):
            if isinstance(node.func.value, ast.Name) and node.func.value.id == "requests":
                if node.func.attr in {"get", "post", "put", "delete", "patch", "head", "request"}:
                    has_timeout = any(kw.arg == "timeout" for kw.arg in node.keywords)
                    if not has_timeout:
                        self.findings.append({
                            "category": "performance",
                            "severity": "high",
                            "title": "HTTP Request Missing Timeout",
                            "description": f"`requests.{node.func.attr}()` called without an explicit timeout parameter.",
                            "file_path": self.filename,
                            "line_number": line_no,
                            "evidence": line_content,
                            "root_cause": "Network call does not specify a timeout argument.",
                            "impact": "Requests may block indefinitely if the remote server hangs, leading to thread exhaustion and outage.",
                            "recommendation": "Pass explicit timeout parameter (e.g. `timeout=10.0`) to all HTTP calls.",
                            "confidence": 0.95,
                            "source": "python_ast"
                        })
        
        # Check for eval / exec / breakpoint
        if isinstance(node.func, ast.Name):
            if node.func.id in {"eval", "exec"}:
                self.findings.append({
                    "category": "security",
                    "severity": "critical",
                    "title": f"Use of Dangerous Function `{node.func.id}`",
                    "description": f"Dynamic code execution via `{node.func.id}()` detected.",
                    "file_path": self.filename,
                    "line_number": line_no,
                    "evidence": line_content,
                    "root_cause": f"Direct call to python builtin `{node.func.id}`.",
                    "impact": "Allows arbitrary code execution vulnerability if input comes from untrusted source.",
                    "recommendation": f"Remove `{node.func.id}` and replace with safe structured parsers or lookup tables.",
                    "confidence": 0.99,
                    "source": "python_ast"
                })
            elif node.func.id == "breakpoint":
                self.findings.append({
                    "category": "code_quality",
                    "severity": "medium",
                    "title": "Leftover `breakpoint()` Call",
                    "description": "Debugger breakpoint left in code.",
                    "file_path": self.filename,
                    "line_number": line_no,
                    "evidence": line_content,
                    "root_cause": "Development debug breakpoint not removed before deployment.",
                    "impact": "Can freeze production threads waiting for interactive terminal input.",
                    "recommendation": "Remove `breakpoint()` call before pushing to production.",
                    "confidence": 0.95,
                    "source": "python_ast"
                })
            elif node.func.id == "print":
                self.findings.append({
                    "category": "code_quality",
                    "severity": "low",
                    "title": "Use of Raw `print` Statement",
                    "description": "Standard print statement used instead of structured logging.",
                    "file_path": self.filename,
                    "line_number": line_no,
                    "evidence": line_content,
                    "root_cause": "Using `print()` for backend application logging.",
                    "impact": "Unstructured output hampers log filtering, log level control, and observability in production.",
                    "recommendation": "Replace `print()` with standard Python `logging` or a structured logger.",
                    "confidence": 0.85,
                    "source": "python_ast"
                })

        self.generic_visit(node)

    def visit_FunctionDef(self, node: ast.FunctionDef):
        # Cyclomatic / complexity check (statement count)
        statement_count = len(node.body)
        if statement_count > 15:
            self.findings.append({
                "category": "maintainability",
                "severity": "medium",
                "title": f"Overly Complex Function `{node.name}`",
                "description": f"Function `{node.name}` contains {statement_count} statements.",
                "file_path": self.filename,
                "line_number": node.lineno,
                "evidence": f"def {node.name}(...):",
                "root_cause": "Function accumulated excessive responsibilities and statements.",
                "impact": "High complexity reduces readability, increases defect density, and makes unit testing difficult.",
                "recommendation": "Decompose function into smaller, single-responsibility helper functions.",
                "confidence": 0.85,
                "source": "python_ast"
            })
        self.generic_visit(node)


class PythonAnalyzer:
    @staticmethod
    def analyze_file(file_path: str, root_dir: str) -> List[Dict[str, Any]]:
        rel_path = os.path.relpath(file_path, root_dir).replace("\\", "/")
        findings = []

        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()

            # Line-by-line checks for TODO/FIXME
            lines = content.splitlines()
            for idx, line in enumerate(lines, start=1):
                upper_line = line.upper()
                if "#" in line and ("TODO" in upper_line or "FIXME" in upper_line):
                    findings.append({
                        "category": "code_quality",
                        "severity": "low",
                        "title": "Unresolved TODO/FIXME Comment",
                        "description": "Codebase contains unresolved task comments.",
                        "file_path": rel_path,
                        "line_number": idx,
                        "evidence": line.strip(),
                        "root_cause": "Incomplete refactoring or postponed feature work left in comments.",
                        "impact": "Accumulation of technical debt and unaddressed edge cases.",
                        "recommendation": "Address the TODO note or track it in your issue tracker.",
                        "confidence": 0.90,
                        "source": "python_ast"
                    })

            # AST Parsing
            try:
                tree = ast.parse(content, filename=rel_path)
                visitor = PythonASTVisitor(rel_path, content)
                visitor.visit(tree)
                findings.extend(visitor.findings)

                # Check unused imports
                for name, lineno in visitor.imports:
                    # Ignore common standard aliases or dunder modules
                    if name not in visitor.used_names and not name.startswith("_"):
                        line_content = lines[lineno - 1].strip() if lineno <= len(lines) else ""
                        findings.append({
                            "category": "code_quality",
                            "severity": "low",
                            "title": f"Potentially Unused Import `{name}`",
                            "description": f"Imported module or alias `{name}` does not appear to be used in file.",
                            "file_path": rel_path,
                            "line_number": lineno,
                            "evidence": line_content,
                            "root_cause": "Redundant import declaration.",
                            "impact": "Clutters namespace, increases file load time slightly, and confuses maintainers.",
                            "recommendation": f"Remove unused import `{name}`.",
                            "confidence": 0.80,
                            "source": "python_ast"
                        })
            except SyntaxError as syn_err:
                findings.append({
                    "category": "code_quality",
                    "severity": "high",
                    "title": "Python Syntax Error",
                    "description": f"Failed to parse file due to syntax error: {syn_err.msg}",
                    "file_path": rel_path,
                    "line_number": syn_err.lineno or 1,
                    "evidence": syn_err.text.strip() if syn_err.text else "",
                    "root_cause": "Invalid Python syntax in file.",
                    "impact": "Module cannot be imported or executed by Python runtime.",
                    "recommendation": "Fix syntax error at reported line.",
                    "confidence": 1.0,
                    "source": "python_ast"
                })
        except Exception as err:
            pass

        return findings
