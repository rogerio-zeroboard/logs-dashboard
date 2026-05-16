import random
import string
from datetime import datetime, timedelta, timezone
from math import ceil
from typing import Optional
from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import Log
from app.schemas import (
    AggregateResponse,
    IngestResponse,
    LogCreate,
    LogResponse,
    LogUpdate,
    PaginatedResponse,
    SeverityCount,
    SourceCount,
    TrendPoint,
)

SEVERITY_WEIGHTS = {
    "DEBUG": 0.10,
    "INFO": 0.40,
    "WARNING": 0.25,
    "ERROR": 0.20,
    "CRITICAL": 0.05,
}

INGEST_SOURCES = [
    "billing-service",
    "analytics-worker",
    "email-processor",
    "cache-proxy",
    "search-indexer",
    "queue-consumer",
]

LOG_MESSAGES = {
    "DEBUG": [
        "Variable x initialized to None",
        "Function call trace: enter validate_input",
        "Cache miss for key user_1234",
        "Query execution plan: sequential scan",
        "Configuration reload triggered",
    ],
    "INFO": [
        "User login successful",
        "Request processed in 45ms",
        "Background job completed",
        "New session created for user",
        "Configuration loaded from env",
    ],
    "WARNING": [
        "High memory usage detected: 85%",
        "Rate limit approaching for client IP",
        "Deprecated API endpoint accessed",
        "Slow query detected: 2.5s",
        "Connection pool near capacity",
    ],
    "ERROR": [
        "Failed to connect to database",
        "Authentication token expired",
        "Payment processing failed",
        "Unhandled exception in request handler",
        "External service timeout after 30s",
    ],
    "CRITICAL": [
        "Database connection lost",
        "Out of memory error",
        "Disk space critically low",
        "Security breach detected",
        "System failure imminent",
    ],
}


def _generate_random_string(length: int = 8) -> str:
    return "".join(random.choices(string.ascii_lowercase, k=length))


def create_log(db: Session, log_data: LogCreate) -> Log:
    db_log = Log(
        timestamp=log_data.timestamp,
        message=log_data.message,
        severity=log_data.severity,
        source=log_data.source,
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


def get_log(db: Session, log_id: UUID) -> Optional[Log]:
    return db.query(Log).filter(Log.id == log_id).first()


def update_log(db: Session, log_id: UUID, log_data: LogUpdate) -> Optional[Log]:
    db_log = db.query(Log).filter(Log.id == log_id).first()
    if db_log is None:
        return None
    update_data = log_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_log, key, value)
    db.commit()
    db.refresh(db_log)
    return db_log


def delete_log(db: Session, log_id: UUID) -> bool:
    db_log = db.query(Log).filter(Log.id == log_id).first()
    if db_log is None:
        return False
    db.delete(db_log)
    db.commit()
    return True


def list_logs(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    severity: Optional[str] = None,
    source: Optional[str] = None,
    search: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    sort_by: str = "timestamp",
    sort_order: str = "desc",
) -> PaginatedResponse:
    query = db.query(Log)

    if severity:
        query = query.filter(Log.severity == severity)
    if source:
        query = query.filter(Log.source == source)
    if search:
        query = query.filter(Log.message.ilike(f"%{search}%"))
    if start_date:
        query = query.filter(Log.timestamp >= start_date)
    if end_date:
        query = query.filter(Log.timestamp <= end_date)

    total = query.count()

    sort_column = getattr(Log, sort_by, Log.timestamp)
    if sort_order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    total_pages = ceil(total / page_size) if total > 0 else 0
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()

    return PaginatedResponse(
        items=[LogResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


def get_aggregate(
    db: Session,
    severity: Optional[str] = None,
    source: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
) -> AggregateResponse:
    query = db.query(Log)

    if severity:
        query = query.filter(Log.severity == severity)
    if source:
        query = query.filter(Log.source == source)
    if start_date:
        query = query.filter(Log.timestamp >= start_date)
    if end_date:
        query = query.filter(Log.timestamp <= end_date)

    total_count = query.count()

    trend_raw = (
        query.with_entities(
            func.date(Log.timestamp).label("date"),
            Log.severity,
            func.count().label("count"),
        )
        .group_by(func.date(Log.timestamp), Log.severity)
        .order_by(func.date(Log.timestamp))
        .all()
    )
    trend = [
        TrendPoint(date=str(row.date), count=row.count, severity=row.severity) for row in trend_raw
    ]

    severity_raw = (
        query.with_entities(Log.severity, func.count().label("count")).group_by(Log.severity).all()
    )
    severity_distribution = [
        SeverityCount(severity=row.severity, count=row.count) for row in severity_raw
    ]

    source_raw = (
        query.with_entities(Log.source, func.count().label("count"))
        .group_by(Log.source)
        .order_by(func.count().desc())
        .all()
    )
    source_distribution = [SourceCount(source=row.source, count=row.count) for row in source_raw]

    return AggregateResponse(
        trend=trend,
        severity_distribution=severity_distribution,
        source_distribution=source_distribution,
        total_count=total_count,
    )


def ingest_logs(db: Session) -> IngestResponse:
    source = random.choice(INGEST_SOURCES)
    now = datetime.now(timezone.utc)
    start = now - timedelta(days=30)

    logs = []
    for _ in range(500):
        severity = random.choices(
            list(SEVERITY_WEIGHTS.keys()),
            weights=list(SEVERITY_WEIGHTS.values()),
        )[0]
        timestamp = start + timedelta(seconds=random.randint(0, int((now - start).total_seconds())))
        message = random.choice(LOG_MESSAGES[severity])

        logs.append(
            Log(
                timestamp=timestamp,
                message=message,
                severity=severity,
                source=source,
            )
        )

    db.bulk_save_objects(logs)
    db.commit()

    return IngestResponse(
        inserted=500,
        source=source,
        date_range={
            "start": start.isoformat(),
            "end": now.isoformat(),
        },
    )


def export_logs(
    db: Session,
    severity: Optional[str] = None,
    source: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    max_rows: int = 10000,
) -> list[Log]:
    query = db.query(Log)

    if severity:
        query = query.filter(Log.severity == severity)
    if source:
        query = query.filter(Log.source == source)
    if start_date:
        query = query.filter(Log.timestamp >= start_date)
    if end_date:
        query = query.filter(Log.timestamp <= end_date)

    return query.order_by(Log.timestamp.desc()).limit(max_rows).all()
