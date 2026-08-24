def test_list_projects(client):
    response = client.get("/api/projects")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 5
    assert len(data["projects"]) >= 5


def test_get_project_detail(client):
    response = client.get("/api/projects/P1021")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "P1021"
    assert data["title"] == "Construction of Community Hall & Digital Learning Centre"
    assert data["cost_sanctioned"] == 45.0
    assert data["mp"]["name"] == "Rajesh Sharma"
    assert data["contractor"]["name"] == "Apex Infra Corp"


def test_get_project_not_found(client):
    response = client.get("/api/projects/NON_EXISTENT")
    assert response.status_code == 404
    data = response.json()
    assert "not found" in data["detail"].lower()
