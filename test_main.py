from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import pytest

with patch("database.create_engine"), patch("database.sessionmaker"):
    from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Chinook API funcionando"}

def mock_db():
    db = MagicMock()
    yield db

def test_get_artists():
    with patch("routers.artists.get_db", mock_db):
        response = client.get("/artists")
        assert response.status_code == 200

def test_get_albums():
    with patch("routers.albums.get_db", mock_db):
        response = client.get("/albums")
        assert response.status_code == 200

def test_get_tracks():
    with patch("routers.tracks.get_db", mock_db):
        response = client.get("/tracks")
        assert response.status_code == 200

def test_get_customers():
    with patch("routers.customers.get_db", mock_db):
        response = client.get("/customers")
        assert response.status_code == 200
