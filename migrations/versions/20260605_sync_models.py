"""Sync models placeholder migration

Revision ID: 20260605_sync_models
Revises: a1b2c3d4e5f6
Create Date: 2026-06-05
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '20260605_sync_models'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade():
    # No-op placeholder migration that ensures Alembic history continues.
    pass


def downgrade():
    # No-op
    pass
