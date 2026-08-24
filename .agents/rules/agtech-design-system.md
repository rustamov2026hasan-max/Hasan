---
description: Universal UI/UX, Design System, and Database guidelines for the Chorva Kuzatuv AgTech platform.
---

# Chorva Kuzatuv: AgTech Master Guidelines

This rule applies to all frontend and backend code generation for the "Chorva Kuzatuv" project.

## 1. UI/UX & Aesthetics (Glare-Resistant & Ergonomic)
- **Palette**: Use earthy, desaturated tones. Deep Slate (base backgrounds), Clay, and Forest Green. DO NOT use high-vibrancy "neon" tech colors.
- **Backgrounds**: Replace pure white (`#FFFFFF`) with high-value off-whites (`#F4F4F4`) or light grays to reduce glare in harsh sunlight.
- **Contrast**: Ensure at least a 7:1 contrast ratio for all critical telemetry text and badges.
- **Ergonomics (Thumb-Zone)**: Place all primary navigation, map geofence selectors, and action buttons in the lower third of the mobile interface.
- **Touch Targets**: Minimum 48x48dp for all interactive elements to accommodate muddy hands/gloves.
- **Safety**: Guard critical actions (e.g., reset virtual fence) with "Slide-to-Confirm" logic instead of simple taps.
- **Typography & Icons**: Use heavy font weights and solid-fill (not thin-outline) literal icons.

## 2. Agentic UI & Telescoping Interface
- **Telescoping**: Boot farmers into an "Essential Mode" (just Health Score and live map). Expose complex metrics only when scaled/requested.
- **Actionable Prompts**: Instead of raw histograms, display actionable conversational prompts (e.g., "Sector B-12 biomass low. Rotate herd?").
- **Offline-First**: Implement clear, non-intrusive offline state banners indicating local caching and sync status.

## 3. Architecture & Backend
- **Data Engine**: 
  - PostgreSQL (PostGIS) for relational and geographical data.
  - TimescaleDB for high-velocity telemetry sensor streams.
- **Backend APIs**: FastAPI (Python) running in Kubernetes.
- **Data Ingestion**: MQTT brokers (QoS 1) from LoRaWAN and NB-IoT gateways.
