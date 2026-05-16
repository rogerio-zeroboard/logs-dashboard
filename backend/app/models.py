import uuid

from sqlalchemy import Column, DateTime, Index, String, Text, event, func
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class Log(Base):
    __tablename__ = "logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(20), nullable=False)
    source = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    __table_args__ = (
        Index("ix_logs_timestamp", "timestamp"),
        Index("ix_logs_severity", "severity"),
        Index("ix_logs_source", "source"),
        Index("ix_logs_timestamp_severity", "timestamp", "severity"),
        Index("ix_logs_timestamp_source", "timestamp", "source"),
    )


@event.listens_for(Log, "before_update")
def log_before_update(mapper, connection, target):
    target.updated_at = func.now()
