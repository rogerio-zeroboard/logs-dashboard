"""Seed the database with realistic log data."""

import random
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models import Log

SEVERITY_WEIGHTS = {
    "DEBUG": 0.10,
    "INFO": 0.40,
    "WARNING": 0.25,
    "ERROR": 0.20,
    "CRITICAL": 0.05,
}

SOURCES = [
    "api-gateway",
    "auth-service",
    "user-service",
    "payment-service",
    "notification-service",
    "scheduler",
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


def seed_logs(db: Session, count: int = 1_500_000, days: int = 365, batch_size: int = 10_000):
    """Seed the database with realistic log entries."""
    now = datetime.now(timezone.utc)
    start = now - timedelta(days=days)
    span_seconds = int((now - start).total_seconds())

    severities = list(SEVERITY_WEIGHTS.keys())
    weights = list(SEVERITY_WEIGHTS.values())

    inserted = 0
    while inserted < count:
        batch = min(batch_size, count - inserted)
        logs = []
        for _ in range(batch):
            severity = random.choices(severities, weights=weights)[0]
            source = random.choice(SOURCES)
            timestamp = start + timedelta(seconds=random.randint(0, span_seconds))
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
        inserted += batch
        print(f"  Inserted {inserted}/{count} logs...", flush=True)

    print(f"Seeded {count} logs spanning {days} days")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_logs(db)
    finally:
        db.close()
