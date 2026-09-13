from app.core.config import settings
from app.ai.base import BaseAIProvider
from app.ai.demo_provider import DemoProvider
from app.ai.openai_provider import OpenAIProvider

def get_ai_provider() -> BaseAIProvider:
    """
    Returns OpenAIProvider if OPENAI_API_KEY is configured,
    otherwise returns deterministic DemoProvider.
    """
    if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.strip() and not settings.OPENAI_API_KEY.startswith("dummy"):
        return OpenAIProvider(settings.OPENAI_API_KEY)
    return DemoProvider()
