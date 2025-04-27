from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 404  # Root endpoint not defined

def test_get_topics():
    response = client.get("/topics")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert "id" in response.json()[0]
    assert "name" in response.json()[0]
    assert "description" in response.json()[0]

def test_get_posts():
    response = client.get("/posts")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert "id" in response.json()[0]
    assert "title" in response.json()[0]
    assert "content" in response.json()[0]
    assert "topic_id" in response.json()[0]

def test_get_posts_by_topic():
    # Get first topic id
    topics_response = client.get("/topics")
    topic_id = topics_response.json()[0]["id"]
    
    # Get posts for this topic
    response = client.get(f"/posts?topic_id={topic_id}")
    assert response.status_code == 200
    
    # Check that all returned posts have the correct topic_id
    for post in response.json():
        assert post["topic_id"] == topic_id

def test_get_post_by_id():
    # Get first post id
    posts_response = client.get("/posts")
    post_id = posts_response.json()[0]["id"]
    
    # Get this post
    response = client.get(f"/posts/{post_id}")
    assert response.status_code == 200
    assert response.json()["id"] == post_id

def test_get_post_not_found():
    response = client.get("/posts/9999")  # Non-existent post id
    assert response.status_code == 404

def test_login_success():
    response = client.post(
        "/token",
        data={"username": "admin", "password": "admin123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "token_type" in response.json()
    assert response.json()["token_type"] == "bearer"
    assert response.json()["role"] == "admin"

def test_login_wrong_password():
    response = client.post(
        "/token",
        data={"username": "admin", "password": "wrongpassword"}
    )
    assert response.status_code == 401

def test_login_wrong_username():
    response = client.post(
        "/token",
        data={"username": "nonexistent", "password": "admin123"}
    )
    assert response.status_code == 401

def test_protected_route_without_token():
    response = client.get("/users/me")
    assert response.status_code == 401

def test_protected_route_with_token():
    # Login to get token
    login_response = client.post(
        "/token",
        data={"username": "admin", "password": "admin123"}
    )
    token = login_response.json()["access_token"]
    
    # Access protected route with token
    response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "admin"
    assert response.json()["role"] == "admin"

def test_admin_route_with_admin_token():
    # Login as admin to get token
    login_response = client.post(
        "/token",
        data={"username": "admin", "password": "admin123"}
    )
    token = login_response.json()["access_token"]
    
    # Access admin route with admin token
    response = client.get(
        "/admin/users",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_admin_route_with_practice_token():
    # Login as practice user to get token
    login_response = client.post(
        "/token",
        data={"username": "practice", "password": "practice123"}
    )
    token = login_response.json()["access_token"]
    
    # Try to access admin route with practice token
    response = client.get(
        "/admin/users",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403  # Forbidden

def test_create_post_with_admin_token():
    # Login as admin to get token
    login_response = client.post(
        "/token",
        data={"username": "admin", "password": "admin123"}
    )
    token = login_response.json()["access_token"]
    
    # Create a new post
    new_post = {
        "title": "Test Post",
        "content": "This is a test post content",
        "topic_id": 1
    }
    response = client.post(
        "/posts",
        json=new_post,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Test Post"
    assert response.json()["content"] == "This is a test post content"
    assert response.json()["topic_id"] == 1

def test_create_post_without_token():
    new_post = {
        "title": "Test Post",
        "content": "This is a test post content",
        "topic_id": 1
    }
    response = client.post("/posts", json=new_post)
    assert response.status_code == 401  # Unauthorized

def test_create_post_with_practice_token():
    # Login as practice user to get token
    login_response = client.post(
        "/token",
        data={"username": "practice", "password": "practice123"}
    )
    token = login_response.json()["access_token"]
    
    # Try to create a new post
    new_post = {
        "title": "Test Post",
        "content": "This is a test post content",
        "topic_id": 1
    }
    response = client.post(
        "/posts",
        json=new_post,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403  # Forbidden

def test_lab_api_endpoints():
    # Login as practice user to get token
    login_response = client.post(
        "/token",
        data={"username": "practice", "password": "practice123"}
    )
    token = login_response.json()["access_token"]
    
    # Test lab API endpoints
    endpoints = [
        "/lab/api/users",
        "/lab/api/users/1",
        "/lab/api/products"
    ]
    
    for endpoint in endpoints:
        response = client.get(
            endpoint,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert len(response.json()) > 0

def test_lab_db_query():
    # Login as practice user to get token
    login_response = client.post(
        "/token",
        data={"username": "practice", "password": "practice123"}
    )
    token = login_response.json()["access_token"]
    
    # Test DB query endpoint
    query = {
        "schema": "ecommerce",
        "query": "SELECT * FROM products"
    }
    response = client.post(
        "/lab/db/query",
        json=query,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert "columns" in response.json()
    assert "rows" in response.json()
    assert len(response.json()["rows"]) > 0

def test_lab_db_query_non_select():
    # Login as practice user to get token
    login_response = client.post(
        "/token",
        data={"username": "practice", "password": "practice123"}
    )
    token = login_response.json()["access_token"]
    
    # Test DB query endpoint with non-SELECT query
    query = {
        "schema": "ecommerce",
        "query": "DELETE FROM products"
    }
    response = client.post(
        "/lab/db/query",
        json=query,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 400  # Bad Request