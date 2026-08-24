import asyncio
import datetime
import random
import uuid
from typing import List, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import execute_values

app = FastAPI(
    title="Chorva Kuzatuv IoT Ingestion Service",
    description="FastAPI backend to ingest telemetry and simulate realistic cattle sensor data.",
    version="1.0.0"
)

# Database configuration (PostgreSQL + TimescaleDB)
DB_CONFIG = {
    "dbname": "chorva_db",
    "user": "postgres",
    "password": "secure_password",
    "host": "localhost",
    "port": 5432
}

# 1. Pydantic Models based on Source "Data Format 1"
class TelemetryData(BaseModel):
    CattleID: str  # UUID format
    Date: datetime.datetime
    Pulse: float  # Heartbeat (bpm)
    Temperature: float  # Body temperature (°C)
    X: float  # Accelerometer X (Harakat tezlanishi)
    Y: float  # Accelerometer Y
    Z: float  # Accelerometer Z
    Humidity: int  # Relative humidity (%)
    BatteryVoltage: Optional[float] = 3.6  # 38,000mAh Lithium battery voltage

# DB connection helper
def get_db_connection():
    try:
        return psycopg2.connect(**DB_CONFIG)
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

# 2. Ingestion Endpoint (Accepts individual or lists of telemetry)
@app.post("/api/v1/telemetry", status_code=201)
async def ingest_telemetry(data: List[TelemetryData]):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor()
    try:
        # Prepare telemetry data for batch insert
        # Table schema matches SQL defined in database-schema.sql
        insert_query = """
            INSERT INTO telemetry (time, collar_id, latitude, longitude, temperature, heart_rate, accel_x, accel_y, accel_z, humidity, battery_level)
            VALUES %s
        """
        
        values = []
        for record in data:
            # We fetch collar_id mapped to cattle_id
            cursor.execute("SELECT collar_id FROM animals WHERE cattle_id = %s", (record.CattleID,))
            collar_row = cursor.fetchone()
            collar_id = collar_row[0] if collar_row else record.CattleID  # fallback if no mapping found
            
            # Simulated GPS bounding coordinates (grazing area)
            lat = 39.65 + random.uniform(-0.05, 0.05)
            lon = 66.95 + random.uniform(-0.05, 0.05)
            
            values.append((
                record.Date,
                collar_id,
                lat,
                lon,
                record.Temperature,
                int(record.Pulse),
                record.X,
                record.Y,
                record.Z,
                record.Humidity,
                record.BatteryVoltage
            ))
            
        if values:
            execute_values(cursor, insert_query, values)
            conn.commit()
            
        return {"status": "success", "inserted_records": len(values)}
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Data ingestion failed: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# 3. Background Telemetry Generator (Mock Simulator)
class SimulationConfig(BaseModel):
    cattle_ids: List[str]
    interval_seconds: int = 5  # Reporting interval
    active: bool = True

class TelemetrySimulator:
    def __init__(self):
        self.is_running = False
        self._task = None

    async def start(self, config: SimulationConfig):
        if self.is_running:
            return
        self.is_running = True
        self._task = asyncio.create_task(self._run_simulation(config))

    def stop(self):
        self.is_running = False
        if self._task:
            self._task.cancel()

    async def _run_simulation(self, config: SimulationConfig):
        while self.is_running:
            conn = get_db_connection()
            if conn:
                cursor = conn.cursor()
                try:
                    insert_query = """
                        INSERT INTO telemetry (time, collar_id, latitude, longitude, temperature, heart_rate, accel_x, accel_y, accel_z, humidity, battery_level)
                        VALUES %s
                    """
                    
                    now = datetime.datetime.now(datetime.timezone.utc)
                    values = []
                    
                    for cid in config.cattle_ids:
                        cursor.execute("SELECT collar_id FROM animals WHERE cattle_id = %s", (cid,))
                        collar_row = cursor.fetchone()
                        collar_id = collar_row[0] if collar_row else str(uuid.uuid4())
                        
                        # Physiological normal vs anomaly generation logic:
                        # 90% chance normal, 10% chance metabolic/fever anomaly
                        is_normal = random.random() > 0.1
                        
                        if is_normal:
                            # Normal range: Temp 37.78-39.17°C, HR 100-140 bpm, Hum 60-80%
                            temp = round(random.uniform(37.78, 39.17), 2)
                            pulse = int(random.uniform(100, 140))
                            humidity = int(random.uniform(60, 80))
                            # Active grazing vs resting accelerometer values
                            is_active = random.random() > 0.3
                            ax = round(random.uniform(500, 1000) if is_active else random.uniform(50, 200), 2)
                            ay = round(random.uniform(500, 1100) if is_active else random.uniform(50, 200), 2)
                            az = round(random.uniform(400, 900) if is_active else random.uniform(50, 150), 2)
                        else:
                            # Anomaly: Mastitis / Fever (Temp 39.5-41.0°C, high HR 145-160 bpm)
                            temp = round(random.uniform(39.5, 41.0), 2)
                            pulse = int(random.uniform(145, 160))
                            humidity = int(random.uniform(85, 98))
                            ax = round(random.uniform(10, 80), 2)  # Low activity (lethargy/kasallik)
                            ay = round(random.uniform(10, 80), 2)
                            az = round(random.uniform(10, 80), 2)
                            
                        # Bounding box for Samarkand pasture geofence area
                        lat = 39.654212 + random.uniform(-0.002, 0.002)
                        lon = 66.958312 + random.uniform(-0.002, 0.002)
                        battery = round(random.uniform(3.55, 3.60), 3) # lithium discharge curve
                        
                        values.append((
                            now,
                            collar_id,
                            lat,
                            lon,
                            temp,
                            pulse,
                            ax,
                            ay,
                            az,
                            humidity,
                            battery
                        ))
                    
                    if values:
                        execute_values(cursor, insert_query, values)
                        conn.commit()
                        print(f"[{now.isoformat()}] Generated & wrote {len(values)} mock telemetry frames.")
                        
                except Exception as e:
                    conn.rollback()
                    print(f"Simulation loop error: {e}")
                finally:
                    cursor.close()
                    conn.close()
            
            await asyncio.sleep(config.interval_seconds)

simulator = TelemetrySimulator()

# 4. Simulation Control Endpoints
@app.post("/api/v1/simulation/start")
async def start_simulation(config: SimulationConfig, background_tasks: BackgroundTasks):
    if simulator.is_running:
        return {"status": "already_running"}
    await simulator.start(config)
    return {"status": "simulation_started", "interval_seconds": config.interval_seconds, "cattle_count": len(config.cattle_ids)}

@app.post("/api/v1/simulation/stop")
async def stop_simulation():
    if not simulator.is_running:
        return {"status": "not_running"}
    simulator.stop()
    return {"status": "simulation_stopped"}

# Root status
@app.get("/")
async def root():
    return {
        "service": "Chorva Kuzatuv Ingestion API",
        "status": "healthy",
        "simulation_running": simulator.is_running
    }
