import requests
import json  # Unused import example
import sqlite3

CRM_ENDPOINT = "https://crm.internal.example.com/api/tickets"

def fetch_external_user_tickets(user_id: str):
    # ISSUE: Network call without timeout parameter
    response = requests.get(f"{CRM_ENDPOINT}?user_id={user_id}")
    return response.json()

def search_user_notes(user_id: str, search_term: str):
    conn = sqlite3.connect("local.db")
    cursor = conn.cursor()
    # ISSUE: Raw string formatting in SQL query (SQL Injection risk)
    query = f"SELECT * FROM notes WHERE user_id = '{user_id}' AND content LIKE '%{search_term}%'"
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()
    return results
