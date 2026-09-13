from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseAIProvider(ABC):
    @abstractmethod
    def analyze_findings(self, project_name: str, findings: List[Dict[str, Any]]) -> str:
        """Generate an executive summary of findings."""
        pass

    @abstractmethod
    def analyze_incident(self, error_text: str, project_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Analyze raw incident traceback or error log."""
        pass

    @abstractmethod
    def answer_project_question(self, project_context: Dict[str, Any], question: str) -> str:
        """Answer engineering agent questions using strictly available project context."""
        pass
