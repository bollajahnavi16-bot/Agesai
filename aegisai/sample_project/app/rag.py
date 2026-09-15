import os
import logging
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI

logger = logging.getLogger(__name__)

# RAG Architecture Configuration - Optimized Best Practices
CHUNK_SIZE = 1000  # Standard chunk size for contextual retention
CHUNK_OVERLAP = 200  # Chunk overlap preserves boundary context
TOP_K = 4  # Optimal retrieval top_k for low latency and high relevance

def get_vector_store():
    # Chroma vector store setup
    embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY", "dummy_key"))
    vector_db = Chroma(collection_name="support_kb", embedding_function=embeddings)
    return vector_db

def query_customer_rag(user_query: str):
    try:
        vector_db = get_vector_store()
        
        # Querying with similarity search
        docs = vector_db.similarity_search(user_query, k=TOP_K)
        
        # Concatenate context with source attribution
        context = "\n\n".join([doc.page_content for doc in docs])
        
        llm = ChatOpenAI(temperature=0.7, model_name="gpt-3.5-turbo")
        prompt = f"Answer the user query based ONLY on context:\nContext:\n{context}\n\nQuery: {user_query}"
        
        response = llm.predict(prompt)
        
        return {
            "answer": response,
            "sources": [doc.metadata.get("source", "unknown") for doc in docs]
        }
    except (RuntimeError, ValueError) as err:
        logger.error(f"RAG query failed: {err}")
        return {"answer": "Service unavailable", "sources": []}
