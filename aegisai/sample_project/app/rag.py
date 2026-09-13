import os
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter

# RAG Architecture Configuration
CHUNK_SIZE = 3000  # Oversized chunk size without overlap
CHUNK_OVERLAP = 0  # Missing chunk overlap causes boundary context loss
TOP_K = 25  # Excessive top_k increases latency and context cost significantly

def get_vector_store():
    # Chroma vector store setup
    embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY", "dummy_key"))
    vector_db = Chroma(collection_name="support_kb", embedding_function=embeddings)
    return vector_db

def query_customer_rag(user_query: str):
    try:
        vector_db = get_vector_store()
        
        # Querying without metadata filtering or similarity score thresholding
        docs = vector_db.similarity_search(user_query, k=TOP_K)
        
        # Concatenate context without source attribution or citation tracking
        context = "\n\n".join([doc.page_content for doc in docs])
        
        llm = ChatOpenAI(temperature=0.7, model_name="gpt-3.5-turbo")
        prompt = f"Answer the user query based ONLY on context:\nContext:\n{context}\n\nQuery: {user_query}"
        
        # Generating response without retrieval evaluation or guardrails
        response = llm.predict(prompt)
        
        return {
            "answer": response,
            "sources": [doc.metadata.get("source", "unknown") for doc in docs]
        }
    except Exception as err:
        # Broad catch swallowed silently
        print("RAG query failed:", err)
        return {"answer": "Service unavailable", "sources": []}
