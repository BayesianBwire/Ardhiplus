import json
from server import app, db


def setup_module(module):
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with app.app_context():
        db.create_all()


def teardown_module(module):
    with app.app_context():
        db.session.remove()
        db.drop_all()


def register_and_get_token(client):
    with client.session_transaction() as sess:
        sess["csrf_token"] = "tok"
    client.post(
        "/api/register",
        data=json.dumps({"name": "Sender", "email": "s@ex.com", "password": "Abc12345", "role": "broker"}),
        content_type="application/json",
        headers={"X-CSRF-Token": "tok"},
    )
    with client.session_transaction() as sess:
        sess["csrf_token"] = "tok"
    r = client.post(
        "/api/login",
        data=json.dumps({"email": "s@ex.com", "password": "Abc12345"}),
        content_type="application/json",
        headers={"X-CSRF-Token": "tok"},
    )
    return r.get_json()["token"]


def test_send_and_get_message():
    client = app.test_client()
    token = register_and_get_token(client)

    # create recipient
    with app.app_context():
        from server import User

        u = User(name="R", email="r@ex.com", password="x")
        db.session.add(u)
        db.session.commit()
        recipient_id = u.id

    # send message
    resp = client.post(
        "/api/messages",
        data=json.dumps({"recipient_id": recipient_id, "message": "hello"}),
        content_type="application/json",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 201
    mid = resp.get_json()["id"]

    # recipient fetch: create token for recipient
    with client.session_transaction() as sess:
        sess["csrf_token"] = "tok2"
    client.post(
        "/api/register",
        data=json.dumps({"name": "Receiver", "email": "r2@ex.com", "password": "Abc12345", "role": "broker"}),
        content_type="application/json",
        headers={"X-CSRF-Token": "tok2"},
    )

    # For simplicity, fetch message with sender token (allowed)
    resp = client.get(f"/api/messages/{mid}", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "hello"
