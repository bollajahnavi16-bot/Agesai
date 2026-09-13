import os
import re

def is_safe_path(base_dir: str, target_path: str) -> bool:
    """
    Ensure the target path is strictly contained within base_dir.
    Prevents path traversal attacks (e.g. ../ or absolute paths).
    """
    base_abs = os.path.abspath(base_dir)
    target_abs = os.path.abspath(os.path.join(base_dir, target_path))
    return target_abs.startswith(base_abs)

def redact_secrets(text: str) -> str:
    """
    Redact potential secrets such as OpenAI keys or passwords from text string.
    """
    if not text:
        return ""
    # Redact OpenAI API keys
    text = re.sub(r'sk-[a-zA-Z0-9]{32,}', 'sk-***REDACTED***', text)
    # Redact common password variables in code snippets
    text = re.sub(r'(password|secret|key)\s*=\s*["\'][^"\']+["\']', r'\1 = "***REDACTED***"', text, flags=re.IGNORECASE)
    return text
