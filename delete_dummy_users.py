#!/usr/bin/env python3
"""
Delete dummy/test users from the database.
Deletes users with test email patterns.
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URI")

if not DATABASE_URL:
    print("ERROR: SQLALCHEMY_DATABASE_URI not found in .env")
    exit(1)

engine = create_engine(DATABASE_URL)

# Test email patterns for dummy users
test_patterns = [
    "test%",
    "dummy%",
    "temp%",
    "demo%",
    "%@test.com",
    "%@example.com",
    "bilfordderick@gmail.com",  # Test account
]

try:
    with engine.connect() as conn:
        # Build WHERE clause
        conditions = " OR ".join(["LOWER(email) LIKE LOWER('{0}')".format(pattern) for pattern in test_patterns])
        
        # Show users to be deleted
        select_query = text("SELECT id, name, email, role FROM users WHERE {0};".format(conditions))
        result = conn.execute(select_query)
        users = result.fetchall()
        
        if not users:
            print("No dummy users found.")
            exit(0)
        
        print("Found {} dummy user(s) to delete:".format(len(users)))
        for user in users:
            print("  - ID: {}, Name: {}, Email: {}, Role: {}".format(user[0], user[1], user[2], user[3]))
        
        confirm = input("\nProceed with deletion? (yes/no): ").strip().lower()
        if confirm != "yes":
            print("Aborted.")
            exit(0)
        
        # Delete verification tokens first (foreign key constraint)
        sql = "DELETE FROM email_verification_tokens WHERE email IN (SELECT email FROM users WHERE {0});".format(conditions)
        delete_tokens = text(sql)
        conn.execute(delete_tokens)
        
        # Delete users
        delete_query = text("DELETE FROM users WHERE {0};".format(conditions))
        conn.execute(delete_query)
        conn.commit()
        
        print("\n✓ Successfully deleted {} dummy user(s).".format(len(users)))
        
except Exception as e:
    print("ERROR: {}".format(e))
    exit(1)
