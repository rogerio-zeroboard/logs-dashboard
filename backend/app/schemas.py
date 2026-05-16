from datetime import datetime
from enum import Enum
from typing import Generic, Literal, Optional, TypeVar
from uuid import UUID

from pydantic import BaseModel, Field


class SeverityEnum(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class SortField(str, Enum):
    timestamp = "timestamp"
    severity = "severity"
    source = "source"


class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"


class LogCreate(BaseModel):
    timestamp: datetime
    message: str = Field(..., min_length=1, max_length=10000)
    severity: SeverityEnum
    source: str = Field(..., min_length=1, max_length=255)


class LogUpdate(BaseModel):
    timestamp: Optional[datetime] = None
    message: Optional[str] = Field(None, min_length=1, max_length=10000)
    severity: Optional[SeverityEnum] = None
    source: Optional[str] = Field(None, min_length=1, max_length=255)


class LogResponse(BaseModel):
    id: UUID
    timestamp: datetime
    message: str
    severity: SeverityEnum
    source: str

    model_config = {"from_attributes": True}


T = TypeVar("T", bound=BaseModel)


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int


class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None
    field_errors: Optional[dict] = None


class HealthResponse(BaseModel):
    status: Literal["ok", "degraded"]
    database: Literal["connected", "disconnected"]


class IngestResponse(BaseModel):
    inserted: int
    source: str
    date_range: dict


class TrendPoint(BaseModel):
    date: str
    count: int
    severity: Optional[SeverityEnum] = None


class SeverityCount(BaseModel):
    severity: SeverityEnum
    count: int


class SourceCount(BaseModel):
    source: str
    count: int


class AggregateResponse(BaseModel):
    trend: list[TrendPoint]
    severity_distribution: list[SeverityCount]
    source_distribution: list[SourceCount]
    total_count: int
