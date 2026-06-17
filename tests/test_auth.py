import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

client = TestClient(app)

# Ensure tables are created for tests
Base.metadata.create_all(bind=engine)

unique_username = f"user_{uuid.uuid4().hex[:8]}"
unique_email = f"{unique_username}@example.com"

def test_register_user():
    response = client.post(
        "/auth/register",
        json={
            "username": unique_username,
            "email": unique_email,
            "password": "testpassword",
            "full_name": "Test User"
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == unique_username
    assert "id" in data

def test_login_user():
    # Login with the user created in the previous test
    response = client.post(
        "/auth/login",
        data={
            "username": unique_username,
            "password": "testpassword"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_get_me():
    # Login first
    login_response = client.post(
        "/auth/login",
        data={
            "username": unique_username,
            "password": "testpassword"
        },
    )
    token = login_response.json()["access_token"]
    
    response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == unique_username
