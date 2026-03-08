import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Chinook API funcionando"}

def test_get_artists():
    response = client.get("/artists/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_get_artist_by_id():
    response = client.get("/artists/1")
    assert response.status_code == 200
    data = response.json()
    assert "ArtistId" in data
    assert data["ArtistId"] == 1

def test_get_artist_not_found():
    response = client.get("/artists/99999")
    assert response.status_code == 404

def test_get_albums():
    response = client.get("/albums/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_get_tracks():
    response = client.get("/tracks/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_get_tracks_by_genre():
    response = client.get("/tracks/?genre=rock")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_get_track_by_id():
    response = client.get("/tracks/1")
    assert response.status_code == 200
    data = response.json()
    assert "TrackId" in data
    assert data["TrackId"] == 1

def test_get_customers():
    response = client.get("/customers/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_get_customer_by_id():
    response = client.get("/customers/1")
    assert response.status_code == 200
    data = response.json()
    assert "CustomerId" in data
    assert data["CustomerId"] == 1

def test_purchase():
    response = client.post("/invoices/purchase", json={
        "CustomerId": 1,
        "items": [{"TrackId": 2, "Quantity": 1}]
    })
    assert response.status_code == 200
    data = response.json()
    assert "invoice_id" in data
    assert "total" in data
    assert data["total"] == 0.99
