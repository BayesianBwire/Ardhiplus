#!/usr/bin/env python
"""Test database connection"""
from server import app, db

def test_connection():
    try:
        with app.app_context():
            # Try to execute a simple query
            result = db.session.execute(db.text("SELECT 1"))
            print("✓ Database connection successful!")
            print(f"Connection to: {app.config['SQLALCHEMY_DATABASE_URI'].split('@')[1]}")
            return True
    except Exception as e:
        print(f"✗ Database connection failed!")
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_connection()
