import pytest
from unittest.mock import patch, MagicMock

with patch("sqlalchemy.create_engine") as mock_engine:
    mock_engine.return_value = MagicMock()
    from fastapi.testclient import TestClient
    from main import app

client = TestClient(app)

def get_mock_db():
    db = MagicMock()
    db.query.return_value.all.return_value = []
    db.query.return_value.filter.return_value.first.return_value = None
    yield db

def test_root():
    response = client.get("/")
    assert response.status_code == 200

def test_get_artists():
    with patch("database.get_db", get_mock_db):
        response = client.get("/artists/")
        assert response.status_code == 200

def test_get_albums():
    with patch("database.get_db", get_mock_db):
        response = client.get("/albums/")
        assert response.status_code == 200

def test_get_tracks():
    with patch("database.get_db", get_mock_db):
        response = client.get("/tracks/")
        assert response.status_code == 200

def test_get_customers():
    with patch("database.get_db", get_mock_db):
        response = client.get("/customers/")
        assert response.status_code == 200

def test_login_exitoso():
    response = client.post("/auth/login", json={"username": "admin", "password": "admin123"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_fallido():
    response = client.post("/auth/login", json={"username": "admin", "password": "wrongpass"})
    assert response.status_code == 401

def test_token_invalido():
    response = client.get("/auth/verify?token=tokenfalso")
    assert response.status_code == 401
