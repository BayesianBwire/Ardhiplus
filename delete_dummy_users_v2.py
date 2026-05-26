import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URI")

if not DATABASE_URL:
    print("ERROR: SQLALCHEMY_DATABASE_URI not found in .env")
    exit(1)

engine = create_engine(DATABASE_URL)

test_patterns = [
    "test%",
    "dummy%",
    "temp%",
    "demo%",
    "%@test.com",
    "%@example.com",
    "bilfordderick@gmail.com",
]

try:
    with engine.connect() as conn:
        conditions = " OR ".join(["LOWER(email) LIKE LOWER('{0}')".format(pattern) for pattern in test_patterns])
        
        select_query = text("SELECT id, name, email, role FROM users WHERE {0}".format(conditions))
        result = conn.execute(select_query)
        users = result.fetchall()
        
        if not users:
            print("No dummy users found.")
            exit(0)
        
        print("Found {0} dummy user(s) to delete:".format(len(users)))
        for user in users:
            print("  - ID: {0}, Name: {1}, Email: {2}, Role: {3}".format(user[0], user[1], user[2], user[3]))
        
        confirm = input("\nProceed with deletion? (yes/no): ").strip().lower()
        if confirm != "yes":
            print("Aborted.")
            exit(0)
        
        sql = "DELETE FROM email_verification_tokens WHERE email IN (SELECT email FROM users WHERE {0})".format(conditions)
        conn.execute(text(sql))
        
        del_query = "DELETE FROM users WHERE {0}".format(conditions)
        conn.execute(text(del_query))
        conn.commit()
        
        print("\nSuccessfully deleted {0} dummy user(s).".format(len(users)))
        
except Exception as e:
    print("ERROR: {0}".format(str(e)))
    exit(1)
