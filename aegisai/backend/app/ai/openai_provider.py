import json
from typing import List, Dict, Any
from app.ai.base import BaseAIProvider
from app.ai.demo_provider import DemoProvider
from app.core.config import settings

class OpenAIProvider(BaseAIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.fallback = DemoProvider()
        try:
            from openai import OpenAI
            self.client = OpenAI(api_key=api_key)
        except Exception:
            self.client = None

    def analyze_findings(self, project_name: str, findings: List[Dict[str, Any]]) -> str:
        if not self.client:
            return self.fallback.analyze_findings(project_name, findings)
        try:
            prompt = (
                f"You are an AI Engineering Intelligence agent. Analyze these static analysis findings for {project_name}:\n"
                f"{json.dumps(findings[:10], indent=2)}\n"
                f"Provide a concise, professional executive summary with prioritized recommendations."
            )
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception:
            return self.fallback.analyze_findings(project_name, findings)

    def analyze_incident(self, error_text: str, project_context: Dict[str, Any] = None) -> Dict[str, Any]:
        if not self.client:
            return self.fallback.analyze_incident(error_text, project_context)
        try:
            prompt = (
                f"Analyze this error traceback or log string:\n{error_text}\n\n"
                f"Return a JSON object with keys: classification, probable_root_cause, evidence, impact, recommendation, confidence (float 0-1), limitations."
            )
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.2,
                max_tokens=600
            )
            data = json.loads(response.choices[0].message.content)
            return data
        except Exception:
            return self.fallback.analyze_incident(error_text, project_context)

    def answer_project_question(self, project_context: Dict[str, Any], question: str) -> str:
        if not self.client:
            return self.fallback.answer_project_question(project_context, question)
        try:
            prompt = (
                f"You are the AegisAI Engineering Agent. Answer the developer's question strictly based on the following analyzed project context.\n"
                f"Project Context:\n{json.dumps(project_context, indent=2)}\n\n"
                f"If the information is not present in the project context, explicitly state: 'I don't have enough evidence from the analyzed project to determine that.'\n\n"
                f"Question: {question}"
            )
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=600
            )
            return response.choices[0].message.content
        except Exception:
            return self.fallback.answer_project_question(project_context, question)
