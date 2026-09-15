import requests
import sqlite3

CRM_ENDPOINT = "https://crm.internal.example.com/api/tickets"

def fetch_external_user_tickets(user_id: str):
    # HTTP request with explicit timeout parameter
    response = requests.get(f"{CRM_ENDPOINT}?user_id={user_id}", timeout=10.0)
    return response.json()

def search_user_notes(user_id: str, search_term: str):
    conn = sqlite3.connect("local.db")
    cursor = conn.cursor()
    # Parameterized SQL query preventing SQL Injection
    query = "SELECT * FROM notes WHERE user_id = ? AND content LIKE ?"
    cursor.execute(query, (user_id, f"%{search_term}%"))
    results = cursor.fetchall()
    conn.close()
    return results
