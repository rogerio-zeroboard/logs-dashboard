from datetime import datetime, timezone

import pytest

from app import crud, schemas


@pytest.fixture
def db_session(db_session):
    yield db_session


class TestCreateLog:
    def test_create_log_success(self, db_session):
        log_data = schemas.LogCreate(
            timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
            message="Test log message",
            severity="INFO",
            source="test-service",
        )
        log = crud.create_log(db_session, log_data)
        assert log is not None
        assert log.message == "Test log message"
        assert log.severity == "INFO"
        assert log.source == "test-service"
        assert log.id is not None

    def test_create_log_returns_uuid(self, db_session):
        log_data = schemas.LogCreate(
            timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
            message="Test",
            severity="DEBUG",
            source="test",
        )
        log = crud.create_log(db_session, log_data)
        assert log.id is not None


class TestGetLog:
    def test_get_log_found(self, db_session):
        log_data = schemas.LogCreate(
            timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
            message="Findable log",
            severity="WARNING",
            source="test-service",
        )
        created = crud.create_log(db_session, log_data)
        found = crud.get_log(db_session, created.id)
        assert found is not None
        assert found.message == "Findable log"

    def test_get_log_not_found(self, db_session):
        from uuid import uuid4

        found = crud.get_log(db_session, uuid4())
        assert found is None


class TestUpdateLog:
    def test_update_log_success(self, db_session):
        log_data = schemas.LogCreate(
            timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
            message="Original",
            severity="INFO",
            source="test-service",
        )
        created = crud.create_log(db_session, log_data)
        update_data = schemas.LogUpdate(message="Updated")
        updated = crud.update_log(db_session, created.id, update_data)
        assert updated is not None
        assert updated.message == "Updated"

    def test_update_log_not_found(self, db_session):
        from uuid import uuid4

        update_data = schemas.LogUpdate(message="Updated")
        result = crud.update_log(db_session, uuid4(), update_data)
        assert result is None

    def test_update_log_partial(self, db_session):
        log_data = schemas.LogCreate(
            timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
            message="Original",
            severity="INFO",
            source="test-service",
        )
        created = crud.create_log(db_session, log_data)
        update_data = schemas.LogUpdate(severity="ERROR")
        updated = crud.update_log(db_session, created.id, update_data)
        assert updated.severity == "ERROR"
        assert updated.message == "Original"


class TestDeleteLog:
    def test_delete_log_success(self, db_session):
        log_data = schemas.LogCreate(
            timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
            message="To delete",
            severity="INFO",
            source="test-service",
        )
        created = crud.create_log(db_session, log_data)
        result = crud.delete_log(db_session, created.id)
        assert result is True
        assert crud.get_log(db_session, created.id) is None

    def test_delete_log_not_found(self, db_session):
        from uuid import uuid4

        result = crud.delete_log(db_session, uuid4())
        assert result is False


class TestListLogs:
    def test_list_logs_empty(self, db_session):
        result = crud.list_logs(db_session)
        assert result.items == []
        assert result.total == 0

    def test_list_logs_with_data(self, db_session):
        for i in range(5):
            log_data = schemas.LogCreate(
                timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
                message=f"Log {i}",
                severity="INFO",
                source="test-service",
            )
            crud.create_log(db_session, log_data)
        result = crud.list_logs(db_session)
        assert len(result.items) == 5
        assert result.total == 5

    def test_list_logs_pagination(self, db_session):
        for i in range(10):
            log_data = schemas.LogCreate(
                timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
                message=f"Log {i}",
                severity="INFO",
                source="test-service",
            )
            crud.create_log(db_session, log_data)
        result = crud.list_logs(db_session, page=1, page_size=3)
        assert len(result.items) == 3
        assert result.total == 10
        assert result.total_pages == 4

    def test_list_logs_filter_severity(self, db_session):
        for sev in ["INFO", "ERROR", "INFO"]:
            log_data = schemas.LogCreate(
                timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
                message="Test",
                severity=sev,
                source="test-service",
            )
            crud.create_log(db_session, log_data)
        result = crud.list_logs(db_session, severity="INFO")
        assert result.total == 2

    def test_list_logs_filter_source(self, db_session):
        for src in ["service-a", "service-b", "service-a"]:
            log_data = schemas.LogCreate(
                timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
                message="Test",
                severity="INFO",
                source=src,
            )
            crud.create_log(db_session, log_data)
        result = crud.list_logs(db_session, source="service-a")
        assert result.total == 2

    def test_list_logs_search(self, db_session):
        log_data = schemas.LogCreate(
            timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
            message="Unique search term here",
            severity="INFO",
            source="test-service",
        )
        crud.create_log(db_session, log_data)
        result = crud.list_logs(db_session, search="Unique search")
        assert result.total == 1

    def test_list_logs_sort_by_timestamp(self, db_session):
        times = [
            datetime(2024, 1, 10, tzinfo=timezone.utc),
            datetime(2024, 1, 20, tzinfo=timezone.utc),
            datetime(2024, 1, 15, tzinfo=timezone.utc),
        ]
        for t in times:
            log_data = schemas.LogCreate(
                timestamp=t,
                message="Test",
                severity="INFO",
                source="test-service",
            )
            crud.create_log(db_session, log_data)
        result = crud.list_logs(db_session, sort_by="timestamp", sort_order="asc")
        assert result.items[0].timestamp < result.items[1].timestamp


class TestGetAggregate:
    def test_aggregate_empty(self, db_session):
        result = crud.get_aggregate(db_session)
        assert result.total_count == 0
        assert result.trend == []
        assert result.severity_distribution == []
        assert result.source_distribution == []

    def test_aggregate_with_data(self, db_session):
        for sev in ["INFO", "INFO", "ERROR"]:
            log_data = schemas.LogCreate(
                timestamp=datetime(2024, 1, 15, tzinfo=timezone.utc),
                message="Test",
                severity=sev,
                source="test-service",
            )
            crud.create_log(db_session, log_data)
        result = crud.get_aggregate(db_session)
        assert result.total_count == 3
        assert len(result.severity_distribution) > 0


class TestIngestLogs:
    def test_ingest_returns_response(self, db_session):
        result = crud.ingest_logs(db_session)
        assert result.inserted > 0
        assert result.source is not None
        assert "start" in result.date_range
        assert "end" in result.date_range

    def test_ingest_adds_records(self, db_session):
        before = crud.list_logs(db_session).total
        result = crud.ingest_logs(db_session)
        after = crud.list_logs(db_session).total
        assert after == before + result.inserted
