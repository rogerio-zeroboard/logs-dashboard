class TestHealthEndpoint:
    def test_health_check(self, client):
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["database"] == "connected"


class TestCreateLogEndpoint:
    def test_create_log_success(self, client, sample_log_data):
        response = client.post("/api/v1/logs", json=sample_log_data)
        assert response.status_code == 201
        data = response.json()
        assert data["message"] == sample_log_data["message"]
        assert data["severity"] == sample_log_data["severity"]
        assert data["source"] == sample_log_data["source"]
        assert "id" in data

    def test_create_log_validation_error(self, client):
        response = client.post("/api/v1/logs", json={"message": ""})
        assert response.status_code == 422

    def test_create_log_invalid_severity(self, client, sample_log_data):
        sample_log_data["severity"] = "INVALID"
        response = client.post("/api/v1/logs", json=sample_log_data)
        assert response.status_code == 422


class TestGetLogEndpoint:
    def test_get_log_success(self, client, sample_log_data):
        create_resp = client.post("/api/v1/logs", json=sample_log_data)
        log_id = create_resp.json()["id"]
        response = client.get(f"/api/v1/logs/{log_id}")
        assert response.status_code == 200
        assert response.json()["id"] == log_id

    def test_get_log_not_found(self, client):
        response = client.get("/api/v1/logs/00000000-0000-0000-0000-000000000000")
        assert response.status_code == 404


class TestListLogsEndpoint:
    def test_list_logs_empty(self, client):
        response = client.get("/api/v1/logs")
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0

    def test_list_logs_with_data(self, client, sample_log_data):
        client.post("/api/v1/logs", json=sample_log_data)
        response = client.get("/api/v1/logs")
        assert response.status_code == 200
        assert response.json()["total"] == 1

    def test_list_logs_pagination(self, client, sample_log_data):
        for i in range(5):
            data = {**sample_log_data, "message": f"Log {i}"}
            client.post("/api/v1/logs", json=data)
        response = client.get("/api/v1/logs?page=1&page_size=2")
        data = response.json()
        assert len(data["items"]) == 2
        assert data["total"] == 5
        assert data["total_pages"] == 3

    def test_list_logs_filter_severity(self, client, sample_log_data):
        client.post("/api/v1/logs", json=sample_log_data)
        error_data = {**sample_log_data, "severity": "ERROR", "message": "Error log"}
        client.post("/api/v1/logs", json=error_data)
        response = client.get("/api/v1/logs?severity=INFO")
        assert response.json()["total"] == 1

    def test_list_logs_filter_source(self, client, sample_log_data):
        client.post("/api/v1/logs", json=sample_log_data)
        other_data = {**sample_log_data, "source": "other-service", "message": "Other"}
        client.post("/api/v1/logs", json=other_data)
        response = client.get("/api/v1/logs?source=auth-service")
        assert response.json()["total"] == 1

    def test_list_logs_search(self, client, sample_log_data):
        client.post("/api/v1/logs", json=sample_log_data)
        response = client.get("/api/v1/logs?search=login")
        assert response.json()["total"] == 1

    def test_list_logs_sort_asc(self, client, sample_log_data):
        client.post("/api/v1/logs", json=sample_log_data)
        response = client.get("/api/v1/logs?sort_by=timestamp&sort_order=asc")
        assert response.status_code == 200

    def test_list_logs_invalid_sort(self, client):
        response = client.get("/api/v1/logs?sort_by=invalid_field")
        assert response.status_code == 422


class TestUpdateLogEndpoint:
    def test_update_log_success(self, client, sample_log_data):
        create_resp = client.post("/api/v1/logs", json=sample_log_data)
        log_id = create_resp.json()["id"]
        response = client.put(f"/api/v1/logs/{log_id}", json={"message": "Updated"})
        assert response.status_code == 200
        assert response.json()["message"] == "Updated"

    def test_update_log_not_found(self, client):
        response = client.put(
            "/api/v1/logs/00000000-0000-0000-0000-000000000000",
            json={"message": "Updated"},
        )
        assert response.status_code == 404


class TestDeleteLogEndpoint:
    def test_delete_log_success(self, client, sample_log_data):
        create_resp = client.post("/api/v1/logs", json=sample_log_data)
        log_id = create_resp.json()["id"]
        response = client.delete(f"/api/v1/logs/{log_id}")
        assert response.status_code == 204

    def test_delete_log_not_found(self, client):
        response = client.delete("/api/v1/logs/00000000-0000-0000-0000-000000000000")
        assert response.status_code == 404


class TestAggregateEndpoint:
    def test_aggregate_empty(self, client):
        response = client.get("/api/v1/logs/aggregate")
        assert response.status_code == 200
        data = response.json()
        assert data["total_count"] == 0
        assert data["trend"] == []
        assert data["severity_distribution"] == []
        assert data["source_distribution"] == []

    def test_aggregate_with_data(self, client, sample_log_data):
        client.post("/api/v1/logs", json=sample_log_data)
        response = client.get("/api/v1/logs/aggregate")
        assert response.status_code == 200
        assert response.json()["total_count"] == 1


class TestIngestEndpoint:
    def test_ingest_success(self, client):
        response = client.post("/api/v1/logs/ingest")
        assert response.status_code == 201
        data = response.json()
        assert data["inserted"] > 0
        assert "source" in data
        assert "date_range" in data

    def test_ingest_returns_correct_schema(self, client):
        response = client.post("/api/v1/logs/ingest")
        data = response.json()
        assert "inserted" in data
        assert "source" in data
        assert "start" in data["date_range"]
        assert "end" in data["date_range"]


class TestExportEndpoint:
    def test_export_csv(self, client, sample_log_data):
        client.post("/api/v1/logs", json=sample_log_data)
        response = client.get("/api/v1/logs/export")
        assert response.status_code == 200
        assert "text/csv" in response.headers["content-type"]
        content = response.text
        assert "id,timestamp,message,severity,source" in content
        assert "Test login successful" in content or "auth-service" in content
