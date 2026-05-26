import os
from dotenv import load_dotenv

load_dotenv()

from server import app, send_email

RECIPIENT = os.environ.get("TEST_EMAIL_TO", "bilfordderick@gmail.com")

if __name__ == "__main__":
    subject = "Test: Ardhi Plus Registration Email"
    text_body = (
        "Hi there,\n\n" 
        "This is a test registration-style email from Ardhi Plus.\n\n"
        "If you received this, SMTP is configured correctly.\n\n"
        "— Ardhi Plus Team"
    )
    html_body = (
        "<p>Hi there,</p>"
        "<p>This is a test registration-style email from Ardhi Plus.</p>"
        "<p>If you received this, SMTP is configured correctly.</p>"
        "<p>— Ardhi Plus Team</p>"
    )

    success = send_email(RECIPIENT, subject, text_body, html_body)
    print("Email sent?", success)
