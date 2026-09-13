from typing import Optional, List
from pydantic import BaseModel

class AgentChatRequest(BaseModel):
    project_id: str
    message: str

class AgentChatResponse(BaseModel):
    project_id: str
    message: str
    response: str
    context_used: Optional[List[str]] = []
    mode: str  # demo or openai
