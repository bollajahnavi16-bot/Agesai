import math
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.telemetry import Telemetry
from app.schemas.telemetry import AnomalyItem

class TelemetryService:
    @staticmethod
    def get_telemetry(db: Session, project_id: str) -> List[Telemetry]:
        points = db.query(Telemetry).filter(Telemetry.project_id == project_id).order_by(Telemetry.timestamp.asc()).all()
        if not points:
            # Seed deterministic sample demo telemetry if none exists
            points = TelemetryService._seed_demo_telemetry(db, project_id)
        return points

    @staticmethod
    def analyze_anomalies(db: Session, project_id: str) -> Dict[str, Any]:
        points = TelemetryService.get_telemetry(db, project_id)
        
        # Group by metric_type
        by_metric: Dict[str, List[Telemetry]] = {}
        for p in points:
            by_metric.setdefault(p.metric_type, []).append(p)

        anomalies: List[AnomalyItem] = []
        metrics_summary = {}

        for mtype, values_list in by_metric.items():
            vals = [v.value for v in values_list]
            if not vals:
                continue

            mean = sum(vals) / len(vals)
            variance = sum((x - mean) ** 2 for x in vals) / len(vals)
            std_dev = math.sqrt(variance) if variance > 0 else 1.0

            metrics_summary[mtype] = {
                "count": len(vals),
                "mean": round(mean, 2),
                "min": round(min(vals), 2),
                "max": round(max(vals), 2),
                "std_dev": round(std_dev, 2)
            }

            for p in values_list:
                z_score = (p.value - mean) / std_dev if std_dev > 0 else 0
                if z_score > 2.0:  # Flag as statistical anomaly (> 2 standard deviations)
                    severity = "critical" if z_score > 3.0 else "high"
                    anomalies.append(AnomalyItem(
                        metric_type=p.metric_type,
                        timestamp=p.timestamp,
                        value=p.value,
                        expected_mean=round(mean, 2),
                        z_score=round(z_score, 2),
                        severity=severity,
                        description=f"Spike detected in `{mtype}` ({p.value}) vs normal average ({round(mean, 2)}) — Z-score: {round(z_score, 1)}σ"
                    ))

        return {
            "project_id": project_id,
            "is_demo_data": True,
            "total_data_points": len(points),
            "anomalies": anomalies,
            "metrics_summary": metrics_summary
        }

    @staticmethod
    def _seed_demo_telemetry(db: Session, project_id: str) -> List[Telemetry]:
        now = datetime.utcnow()
        seeded = []
        
        # Generate 24 hours of data points
        for i in range(24):
            t_time = now - timedelta(hours=(24 - i))
            
            # Normal baseline with occasional artificial spikes for anomaly demonstration
            latency = 120.0 + (i * 3.5) % 45
            if i in {8, 19}:  # Anomaly points at index 8 and 19
                latency = 680.0
            
            error_rate = 0.5 if i not in {8, 19} else 8.5
            request_count = 150 + (i * 12) % 80
            retrieval_latency = 45.0 + (i * 2) % 20 if i not in {8, 19} else 340.0
            
            items = [
                Telemetry(id=f"tel_{uuid.uuid4().hex[:8]}", project_id=project_id, timestamp=t_time, metric_type="latency", value=latency),
                Telemetry(id=f"tel_{uuid.uuid4().hex[:8]}", project_id=project_id, timestamp=t_time, metric_type="error_rate", value=error_rate),
                Telemetry(id=f"tel_{uuid.uuid4().hex[:8]}", project_id=project_id, timestamp=t_time, metric_type="request_count", value=float(request_count)),
                Telemetry(id=f"tel_{uuid.uuid4().hex[:8]}", project_id=project_id, timestamp=t_time, metric_type="retrieval_latency", value=retrieval_latency)
            ]
            for item in items:
                db.add(item)
                seeded.append(item)

        db.commit()
        return seeded
