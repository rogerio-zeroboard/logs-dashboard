import csv
import io
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas import (
    AggregateResponse,
    HealthResponse,
    IngestResponse,
    LogCreate,
    LogResponse,
    LogUpdate,
    PaginatedResponse,
    SeverityEnum,
    SortField,
    SortOrder,
)

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return HealthResponse(status="ok", database="connected")
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Database unreachable") from exc


@router.get("/logs/sources")
def get_sources(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT DISTINCT source FROM logs ORDER BY source"))
    return [row[0] for row in result.fetchall()]


@router.get("/logs/aggregate", response_model=AggregateResponse)
def get_aggregate(
    severity: Optional[SeverityEnum] = None,
    source: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
):
    return crud.get_aggregate(
        db,
        severity=severity.value if severity else None,
        source=source,
        start_date=start_date,
        end_date=end_date,
    )


@router.get("/logs/export")
def export_logs(
    severity: Optional[SeverityEnum] = None,
    source: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
):
    logs = crud.export_logs(
        db,
        severity=severity.value if severity else None,
        source=source,
        start_date=start_date,
        end_date=end_date,
    )

    def sanitize_csv_value(value: str) -> str:
        """Prefix cells that start with formula-triggering characters to prevent CSV injection."""
        if value and value[0] in ("=", "+", "-", "@", "\t", "\r"):
            return f"'{value}"
        return value

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "timestamp", "message", "severity", "source"])
    for log in logs:
        writer.writerow(
            [
                log.id,
                log.timestamp,
                sanitize_csv_value(log.message),
                log.severity,
                sanitize_csv_value(log.source),
            ]
        )

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=logs.csv"},
    )


@router.post("/logs/ingest", response_model=IngestResponse, status_code=201)
def ingest_logs(db: Session = Depends(get_db)):
    return crud.ingest_logs(db)


@router.post("/logs", response_model=LogResponse, status_code=201)
def create_log(log_data: LogCreate, db: Session = Depends(get_db)):
    return crud.create_log(db, log_data)


@router.get("/logs", response_model=PaginatedResponse)
def list_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    severity: Optional[SeverityEnum] = None,
    source: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    search: Optional[str] = None,
    sort_by: SortField = SortField.timestamp,
    sort_order: SortOrder = SortOrder.desc,
    db: Session = Depends(get_db),
):
    return crud.list_logs(
        db,
        page=page,
        page_size=page_size,
        severity=severity.value if severity else None,
        source=source,
        search=search,
        start_date=start_date,
        end_date=end_date,
        sort_by=sort_by.value,
        sort_order=sort_order.value,
    )


@router.get("/logs/{log_id}", response_model=LogResponse)
def get_log(log_id: UUID, db: Session = Depends(get_db)):
    log = crud.get_log(db, log_id)
    if log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    return log


@router.put("/logs/{log_id}", response_model=LogResponse)
def update_log(log_id: UUID, log_data: LogUpdate, db: Session = Depends(get_db)):
    log = crud.update_log(db, log_id, log_data)
    if log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    return log


@router.delete("/logs/{log_id}", status_code=204)
def delete_log(log_id: UUID, db: Session = Depends(get_db)):
    success = crud.delete_log(db, log_id)
    if not success:
        raise HTTPException(status_code=404, detail="Log not found")
    return None
