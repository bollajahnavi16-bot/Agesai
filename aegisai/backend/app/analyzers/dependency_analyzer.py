import os
import re
import json
from typing import List, Dict, Any, Tuple

class DependencyAnalyzer:
    @staticmethod
    def analyze_project(root_dir: str) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Parses dependency manifests in project root and subdirectories.
        Returns: (inventory_list, findings_list)
        """
        inventory = []
        findings = []

        # Track manifest status
        manifest_found = False

        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in {".git", ".venv", "venv", "node_modules", "__pycache__"}]
            
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, root_dir).replace("\\", "/")

                if file == "requirements.txt":
                    manifest_found = True
                    deps, file_findings = DependencyAnalyzer._parse_requirements_txt(full_path, rel_path)
                    inventory.extend(deps)
                    findings.extend(file_findings)
                elif file == "package.json":
                    manifest_found = True
                    deps, file_findings = DependencyAnalyzer._parse_package_json(full_path, rel_path)
                    inventory.extend(deps)
                    findings.extend(file_findings)

        if manifest_found:
            # Informational status finding per requirement:
            findings.append({
                "category": "dependency",
                "severity": "low",
                "title": "Dependency Audit Status",
                "description": "Dependency inventory constructed statically. Automated live vulnerability database verification unavailable.",
                "file_path": "requirements.txt",
                "line_number": 1,
                "evidence": "Automated vulnerability verification unavailable.",
                "root_cause": "Live online vulnerability database feed not attached.",
                "impact": "Unscanned sub-dependencies might harbor unpatched CVEs.",
                "recommendation": "Integrate pip-audit or Snyk in CI/CD pipeline for live CVE scanning.",
                "confidence": 1.0,
                "source": "dependency_analyzer"
            })

        return inventory, findings

    @staticmethod
    def _parse_requirements_txt(file_path: str, rel_path: str) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        inventory = []
        findings = []

        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.readlines()

            for idx, line in enumerate(lines, start=1):
                clean_line = line.strip()
                if not clean_line or clean_line.startswith("#") or clean_line.startswith("-"):
                    continue

                # Match package and version specifier
                match = re.match(r'^([a-zA-Z0-9_\-\.]+)\s*([==|>=|<=|~=|>|<].*)?$', clean_line)
                if match:
                    pkg_name = match.group(1)
                    version_spec = match.group(2) or "Unpinned"
                    
                    inventory.append({
                        "name": pkg_name,
                        "version": version_spec,
                        "manifest": rel_path
                    })

                    # Flag unpinned packages
                    if version_spec == "Unpinned":
                        findings.append({
                            "category": "dependency",
                            "severity": "medium",
                            "title": f"Unpinned Dependency `{pkg_name}`",
                            "description": f"Package `{pkg_name}` does not specify an explicit version constraint.",
                            "file_path": rel_path,
                            "line_number": idx,
                            "evidence": clean_line,
                            "root_cause": "Dependency listed without version pinning in manifest.",
                            "impact": "Build non-determinism; sudden upstream updates may break runtime functionality.",
                            "recommendation": f"Pin dependency to exact release version (e.g. `{pkg_name}==1.2.3`).",
                            "confidence": 0.90,
                            "source": "dependency_analyzer"
                        })
        except Exception:
            pass

        return inventory, findings

    @staticmethod
    def _parse_package_json(file_path: str, rel_path: str) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        inventory = []
        findings = []

        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                data = json.load(f)

            deps = data.get("dependencies", {})
            dev_deps = data.get("devDependencies", {})

            all_deps = {**deps, **dev_deps}
            for pkg_name, ver in all_deps.items():
                inventory.append({
                    "name": pkg_name,
                    "version": str(ver),
                    "manifest": rel_path
                })
        except Exception:
            pass

        return inventory, findings
