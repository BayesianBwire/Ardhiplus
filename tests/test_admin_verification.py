import json
import os

os.environ.setdefault("ALLOW_SQLITE_DEV", "1")
os.environ.setdefault("SKIP_DB_CHECK", "1")

from server import app, db, Listing, User


def setup_module(module):
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with app.app_context():
        db.create_all()


def teardown_module(module):
    with app.app_context():
        db.session.remove()
        db.drop_all()


def test_verify_listing_updates_status():
    client = app.test_client()
    with client.session_transaction() as sess:
        sess["csrf_token"] = "tok"

    with app.app_context():
        user = User(name="Admin", email="admin@example.com", password="Abc12345", role="admin")
        db.session.add(user)
        db.session.commit()

        listing = Listing(
            title="Demo Land",
            location="Nakuru",
            size="2 acres",
            type="Land",
            price="KSh 1M",
            description="Demo property",
            seller_name="A",
            seller_email="a@example.com",
            seller_phone="123",
            seller_notes="n",
        )
        db.session.add(listing)
        db.session.commit()
        listing_id = listing.id

    with client.session_transaction() as sess:
        sess["user_id"] = user.id
        sess["csrf_token"] = "tok"

    response = client.post(
        "/api/verify-listing",
        data=json.dumps({"listing_id": listing_id}),
        content_type="application/json",
        headers={"X-CSRF-Token": "tok"},
    )

    assert response.status_code == 200
    payload = response.get_json()
    assert payload["status"] == "success"
    assert payload["listing"]["verified"] is True
    assert payload["listing"]["badge"] == "Verified Survey"
