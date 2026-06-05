#!/usr/bin/env python
"""Seed development data: users, listings, and leads."""
from server import app, db
from server import User, Listing, InterestRequest
from werkzeug.security import generate_password_hash

SAMPLE_PASSWORD = "password123"

users = [
    {"name": "Alice Agent", "email": "alice@agent.test", "role": "agent"},
    {"name": "Bob Broker", "email": "bob@broker.test", "role": "broker"},
    {"name": "Carol Owner", "email": "carol@owner.test", "role": "owner"},
]

listings = [
    {
        "title": "Prime Residential Plot",
        "location": "Nairobi, Kenya",
        "size": "500 sqm",
        "type": "Residential",
        "price": "KES 3,500,000",
        "description": "A flat, well-located plot near amenities.",
        "verified": True,
        "badge": "Verified Survey",
        "seller_email": "alice@agent.test",
    },
    {
        "title": "2 acre farm land",
        "location": "Rift Valley",
        "size": "2 acres",
        "type": "Agricultural",
        "price": "KES 1,200,000",
        "description": "Fertile farm land with water access.",
        "verified": False,
        "badge": "Survey Pending",
        "seller_email": "bob@broker.test",
    },
]

leads = [
    {
        "listing_title": "Prime Residential Plot",
        "buyer_name": "Jane Mwende",
        "buyer_email": "jane@example.com",
        "buyer_phone": "+254700111222",
        "message": "Interested — please send details",
    },
    {
        "listing_title": "2 acre farm land",
        "buyer_name": "Peter Otieno",
        "buyer_email": "peter@example.com",
        "buyer_phone": "+254700333444",
        "message": "Is price negotiable?",
    },
]

if __name__ == "__main__":
    with app.app_context():
        created = {"users": 0, "listings": 0, "leads": 0}

        for u in users:
            existing = User.query.filter_by(email=u["email"]).first()
            if existing:
                continue
            new = User(name=u["name"], email=u["email"], password=generate_password_hash(SAMPLE_PASSWORD), role=u["role"])
            db.session.add(new)
            created["users"] += 1

        for l in listings:
            existing = Listing.query.filter_by(title=l["title"]).first()
            if existing:
                continue
            newl = Listing(
                title=l["title"],
                location=l["location"],
                size=l["size"],
                type=l["type"],
                price=l["price"],
                description=l["description"],
                verified=l.get("verified", False),
                badge=l.get("badge", "Pending approval"),
                seller_email=l.get("seller_email"),
                seller_name=l.get("seller_email"),
            )
            db.session.add(newl)
            created["listings"] += 1

        db.session.commit()

        for ld in leads:
            existing = InterestRequest.query.filter_by(listing_title=ld["listing_title"], buyer_email=ld["buyer_email"]).first()
            if existing:
                continue
            newlead = InterestRequest(
                listing_title=ld["listing_title"],
                buyer_name=ld["buyer_name"],
                buyer_email=ld["buyer_email"],
                buyer_phone=ld["buyer_phone"],
                message=ld.get("message", ""),
            )
            db.session.add(newlead)
            created["leads"] += 1

        db.session.commit()
        print("Seed complete:", created)
        print("Sample credentials: alice@agent.test / password123")
