#!/usr/bin/env python
"""Create all database tables (simple migration helper)."""
from server import app, db

if __name__ == "__main__":
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Done.")
