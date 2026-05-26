import json
from server import app, db, User


def setup_module(module):
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with app.app_context():
        db.create_all()


def teardown_module(module):
    with app.app_context():
        db.session.remove()
        db.drop_all()


def test_register_and_login():
    client = app.test_client()
    with client.session_transaction() as sess:
        sess["csrf_token"] = "tok"

    # Register
    resp = client.post(
        "/api/register",
        data=json.dumps({"name": "TUser", "email": "t@ex.com", "password": "Abc12345", "role": "broker"}),
        content_type="application/json",
        headers={"X-CSRF-Token": "tok"},
    )
    assert resp.status_code == 201

    # Login
    with client.session_transaction() as sess:
        sess["csrf_token"] = "tok"
    resp = client.post(
        "/api/login",
        data=json.dumps({"email": "t@ex.com", "password": "Abc12345"}),
        content_type="application/json",
        headers={"X-CSRF-Token": "tok"},
    )
    assert resp.status_code == 200
    data = resp.get_json()
    assert "token" in data

    # Access protected endpoint
    token = data["token"]
    resp = client.get("/api/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    info = resp.get_json()
    assert info["email"] == "t@ex.com"
