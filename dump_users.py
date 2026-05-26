#!/usr/bin/env python
"""List users from the application's database.
Usage:
  py dump_users.py
"""
from server import app, db, User

if __name__ == "__main__":
    with app.app_context():
        users = User.query.order_by(User.id).all()
        if not users:
            print("No users found.")
        for u in users:
            print({
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "registered_at": u.registered_at.isoformat() if u.registered_at else None,
            })
