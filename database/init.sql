-- UUID kengaytmasi
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- PostGIS fazoviy kengaytmasi
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. PostgreSQL va PostGIS: Relatsion va Fazoviy ma’lumotlar modeli

-- Fermerlar hisobini saqlash (Data Format 3 asosida)
CREATE TABLE farmers (
    personal_number VARCHAR(50) PRIMARY KEY, -- JShShIR / PINFL yoki STIR / TIN
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    date_of_birth TIMESTAMP WITH TIME ZONE NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Shifrlangan parol xavfsizligi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fermalar va chorvachilik klasterlari (Data Format 2 asosida)
CREATE TABLE farms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    place INT NOT NULL, -- Hududiy tuman kodi
    address TEXT,
    farmer_id VARCHAR(50) REFERENCES farmers(personal_number) ON DELETE CASCADE
);

-- Bo'yinbog' qurilmalari (ESP32-S3 IoT datchigi metadata)
CREATE TABLE collars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number VARCHAR(100) UNIQUE NOT NULL, -- Jismoniy datchik raqami
    battery_voltage FLOAT DEFAULT 3.6, -- 38,000mAh Li-SOCl2 batareya quvvati (4-5 yilga yetadi)
    status VARCHAR(50) DEFAULT 'Active' -- Active, Maintenance, Depleted
);

-- Hayvonlar profili (Data Format 4 asosida)
CREATE TABLE animals (
    cattle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Tizim ichidagi UUID-36 unikal kod
    personal_number VARCHAR(50) UNIQUE, -- Davlat identifikatsiya raqami (Majburiy ro'yxat uchun)
    farm_id INT REFERENCES farms(id) ON DELETE SET NULL,
    name VARCHAR(100),
    gender INT NOT NULL CHECK (gender IN (1, 2)), -- 1: Urg'ochi, 2: Erkak
    birth_date TIMESTAMP WITH TIME ZONE NOT NULL,
    weight DOUBLE PRECISION, -- Og'irligi (kg)
    collar_id UUID REFERENCES collars(id) ON DELETE SET NULL UNIQUE, -- Unikal bo'yinbog' ulanishi
    health_score INT DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100) -- Sun'iy intellekt hisoblagan sog'liq indeksi
);

-- Geofencing (Virtual elektron to'siqlar)
CREATE TABLE geofences (
    id SERIAL PRIMARY KEY,
    farm_id INT REFERENCES farms(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    boundary GEOMETRY(Polygon, 4326) NOT NULL -- WGS84 GPS tizimida koordinatalar
);

-- Fazoviy so'rovlarni tezlashtirish uchun fazoviy indeks (GIST)
CREATE INDEX geofences_boundary_idx ON geofences USING GIST(boundary);


-- 2. TimescaleDB: Vaqtinchalik datchik telemetryasi va Continuous Aggregates

CREATE TABLE telemetry (
    time TIMESTAMPTZ NOT NULL, -- Datchik yozgan aniq vaqt
    collar_id UUID NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    temperature FLOAT, -- Tana harorati datchigi
    heart_rate INT, -- PPG datchigidan yurak urishi (bpm)
    accel_x FLOAT, -- 3-o'qli akselerometr vektori (Harakat tahlili uchun)
    accel_y FLOAT,
    accel_z FLOAT,
    humidity INT, -- Atrof-muhit namligi
    battery_level FLOAT -- Batareya foizi
);

-- Telemetrya jadvalini TimescaleDB hypertable-ga aylantirish (vaqt bo'yicha partitioning)
SELECT create_hypertable('telemetry', 'time', if_not_exists => TRUE);

-- Telemetrya ma'lumotlarini tezkor yuklash uchun indeks
CREATE INDEX telemetry_collar_time_idx ON telemetry (collar_id, time DESC);

-- Soatlik o'rtacha ko'rsatkichlarni doimiy yozib borish
CREATE MATERIALIZED VIEW telemetry_hourly
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', time) AS bucket,
    collar_id,
    avg(temperature) AS avg_temperature,
    avg(heart_rate) AS avg_heart_rate,
    avg(humidity) AS avg_humidity,
    min(battery_level) AS min_battery_level
FROM telemetry
GROUP BY bucket, collar_id;
