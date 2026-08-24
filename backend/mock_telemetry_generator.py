import asyncio
import datetime
import random
import uuid
from typing import List, Optional, Dict
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Chorva Kuzatuv IoT Ingestion Service",
    description="FastAPI backend to ingest telemetry and simulate realistic cattle sensor data.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for mock data
telemetry_data = []
latest_locations = {}
active_alerts = []

# Initialize some mock alerts
active_alerts = [
    {
        "id": str(uuid.uuid4()),
        "animalId": "CH-1002",
        "type": "Geofence Breach",
        "message": "Sigir B-12 sektoridan tashqariga chiqdi",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "isResolved": False
    },
    {
        "id": str(uuid.uuid4()),
        "animalId": "CH-1005",
        "type": "Low Battery",
        "message": "Batareya quvvati 15% dan past",
        "timestamp": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=30)).isoformat(),
        "isResolved": False
    }
]

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

# 2. Ingestion Endpoint
@app.post("/api/v1/telemetry", status_code=201)
async def ingest_telemetry(data: List[TelemetryData]):
    for record in data:
        # Simulate lat/lon based on some logic or just random within Samarkand
        lat = 39.65 + random.uniform(-0.01, 0.01)
        lon = 66.95 + random.uniform(-0.01, 0.01)
        
        telemetry = {
            "CattleID": record.CattleID,
            "Date": record.Date.isoformat(),
            "Temperature": record.Temperature,
            "Pulse": record.Pulse,
            "lat": lat,
            "lon": lon,
            "BatteryVoltage": record.BatteryVoltage
        }
        telemetry_data.append(telemetry)
        latest_locations[record.CattleID] = telemetry

    return {"status": "success", "inserted_records": len(data)}

# 3. GET Endpoints for Dashboard
@app.get("/api/v1/dashboard/stats")
async def get_dashboard_stats():
    total_animals = 450
    offline_count = 12
    # Count how many batteries are low based on latest locations
    low_battery = sum(1 for loc in latest_locations.values() if loc.get("BatteryVoltage", 3.6) < 3.5)
    
    return {
        "totalAnimals": total_animals,
        "onlineCount": total_animals - offline_count,
        "offlineCount": offline_count,
        "activeAlerts": len([a for a in active_alerts if not a["isResolved"]]),
        "lowBatteryCount": low_battery + 3  # Add base mock value
    }

@app.get("/api/v1/dashboard/alerts")
async def get_dashboard_alerts():
    return active_alerts

@app.get("/api/v1/map/locations")
async def get_map_locations():
    # Return array of locations
    locations = []
    for cid, data in latest_locations.items():
        locations.append({
            "id": cid,
            "lat": data["lat"],
            "lng": data["lon"],
            "status": "normal" if data["Temperature"] < 39.2 else "warning"
        })
    # If no data yet, provide some mock data so the map isn't empty
    if not locations:
        locations = [
            {"id": "CH-1001", "lat": 39.654, "lng": 66.958, "status": "normal"},
            {"id": "CH-1002", "lat": 39.655, "lng": 66.959, "status": "warning"},
            {"id": "CH-1003", "lat": 39.653, "lng": 66.957, "status": "normal"},
        ]
    return locations

# 4. Background Telemetry Generator (Mock Simulator)
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
            now = datetime.datetime.now(datetime.timezone.utc)
            for cid in config.cattle_ids:
                is_normal = random.random() > 0.1
                if is_normal:
                    temp = round(random.uniform(37.78, 39.17), 2)
                    pulse = int(random.uniform(100, 140))
                else:
                    temp = round(random.uniform(39.5, 41.0), 2)
                    pulse = int(random.uniform(145, 160))
                    
                lat = 39.654212 + random.uniform(-0.005, 0.005)
                lon = 66.958312 + random.uniform(-0.005, 0.005)
                battery = round(random.uniform(3.55, 3.60), 3)
                
                latest_locations[cid] = {
                    "CattleID": cid,
                    "Date": now.isoformat(),
                    "Temperature": temp,
                    "Pulse": pulse,
                    "lat": lat,
                    "lon": lon,
                    "BatteryVoltage": battery
                }
                
                # Randomly create an alert
                if not is_normal and random.random() > 0.8:
                    active_alerts.insert(0, {
                        "id": str(uuid.uuid4()),
                        "animalId": cid,
                        "type": "Health Warning",
                        "message": f"Yuqori tana harorati: {temp}°C",
                        "timestamp": now.isoformat(),
                        "isResolved": False
                    })
                    # Keep max 10 alerts
                    if len(active_alerts) > 10:
                        active_alerts.pop()
            
            await asyncio.sleep(config.interval_seconds)

simulator = TelemetrySimulator()

# 5. Simulation Control Endpoints
@app.post("/api/v1/simulation/start")
async def start_simulation(config: SimulationConfig):
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
