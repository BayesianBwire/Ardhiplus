#!/usr/bin/env python
"""
Debug script to check what password hash is stored in the DB and test if it matches.
"""
import os
import sys

try:
    from werkzeug.security import check_password_hash, generate_password_hash
except Exception:
    print("Error: werkzeug is required.")
    sys.exit(1)

from server import app, db, User

email = "daudi@ardhiplus.co.ke"
password = "Daudi254!"

with app.app_context():
    user = User.query.filter_by(email=email).first()
    if not user:
        print(f"[ERROR] No user found with email: {email}")
        sys.exit(1)
    
    print(f"[INFO] User found: {user.email}")
    print(f"[INFO] User role: {user.role}")
    print(f"[INFO] Stored password hash (first 50 chars): {str(user.password)[:50]}")
    print(f"[INFO] Stored temp_password: {user.temp_password}")
    
    # Test password check
    test_match = check_password_hash(user.password, password)
    print(f"\n[TEST] check_password_hash(stored_hash, '{password}'): {test_match}")
    
    # Generate a fresh hash and show it
    fresh_hash = generate_password_hash(password)
    print(f"\n[FRESH] Newly generated hash (first 50 chars): {fresh_hash[:50]}")
    print(f"[FRESH] Test fresh hash: {check_password_hash(fresh_hash, password)}")
    
    if not test_match:
        print("\n[ISSUE] Password hash in DB does not match the raw password.")
        print("[FIX] Run: py -3 update_superuser_db.py")
    else:
        print("\n[OK] Password hash matches!")
