from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from app.schemas import (
    AggregateResponse,
    ErrorResponse,
    HealthResponse,
    IngestResponse,
    LogCreate,
    LogUpdate,
    PaginatedResponse,
    SeverityEnum,
)


class TestLogCreate:
    def test_valid_log(self):
        log = LogCreate(
            timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
            message="Test message",
            severity="INFO",
            source="test-service",
        )
        assert log.message == "Test message"
        assert log.severity == SeverityEnum.INFO
        assert log.source == "test-service"

    def test_missing_message_raises(self):
        with pytest.raises(ValidationError):
            LogCreate(
                timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
                message="",
                severity="INFO",
                source="test-service",
            )

    def test_missing_severity_raises(self):
        with pytest.raises(ValidationError):
            LogCreate(
                timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
                message="Test message",
                source="test-service",
            )

    def test_missing_source_raises(self):
        with pytest.raises(ValidationError):
            LogCreate(
                timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
                message="Test message",
                severity="INFO",
            )

    def test_invalid_severity_raises(self):
        with pytest.raises(ValidationError):
            LogCreate(
                timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
                message="Test message",
                severity="INVALID",
                source="test-service",
            )

    def test_all_severity_levels_valid(self):
        for severity in SeverityEnum:
            log = LogCreate(
                timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
                message="Test",
                severity=severity,
                source="test",
            )
            assert log.severity == severity

    def test_message_max_length(self):
        with pytest.raises(ValidationError):
            LogCreate(
                timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
                message="x" * 10001,
                severity="INFO",
                source="test-service",
            )

    def test_source_max_length(self):
        with pytest.raises(ValidationError):
            LogCreate(
                timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
                message="Test",
                severity="INFO",
                source="x" * 256,
            )


class TestLogUpdate:
    def test_partial_update(self):
        update = LogUpdate(message="Updated message")
        assert update.message == "Updated message"
        assert update.severity is None
        assert update.source is None

    def test_empty_update_valid(self):
        update = LogUpdate()
        assert update.timestamp is None
        assert update.message is None
        assert update.severity is None
        assert update.source is None


class TestPaginatedResponse:
    def test_response_structure(self):
        response = PaginatedResponse(
            items=[],
            total=0,
            page=1,
            page_size=20,
            total_pages=0,
        )
        assert response.items == []
        assert response.total == 0
        assert response.page == 1
        assert response.page_size == 20
        assert response.total_pages == 0


class TestErrorResponse:
    def test_with_detail_only(self):
        error = ErrorResponse(detail="Not found")
        assert error.detail == "Not found"
        assert error.error_code is None
        assert error.field_errors is None

    def test_with_full_fields(self):
        error = ErrorResponse(
            detail="Validation failed",
            error_code="VALIDATION_ERROR",
            field_errors={"message": ["Required"]},
        )
        assert error.error_code == "VALIDATION_ERROR"
        assert error.field_errors == {"message": ["Required"]}


class TestHealthResponse:
    def test_healthy(self):
        health = HealthResponse(status="ok", database="connected")
        assert health.status == "ok"
        assert health.database == "connected"

    def test_degraded(self):
        health = HealthResponse(status="degraded", database="disconnected")
        assert health.status == "degraded"


class TestIngestResponse:
    def test_response_structure(self):
        response = IngestResponse(
            inserted=500,
            source="billing-service",
            date_range={"start": "2024-01-01T00:00:00Z", "end": "2024-01-31T23:59:59Z"},
        )
        assert response.inserted == 500
        assert response.source == "billing-service"
        assert "start" in response.date_range
        assert "end" in response.date_range


class TestAggregateResponse:
    def test_response_structure(self):
        response = AggregateResponse(
            trend=[],
            severity_distribution=[],
            source_distribution=[],
            total_count=0,
        )
        assert response.total_count == 0
        assert len(response.trend) == 0
