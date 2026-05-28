# Real-time 3D AIS & ADS-B Telemetry Platform

A real-time geospatial visualization platform for streaming, replaying, and analyzing maritime AIS and aviation ADS-B telemetry in a 3D globe environment.

This project combines a FastAPI backend, websocket-based telemetry streaming, and a Cesium-powered frontend to simulate live vessel and aircraft movement with smooth dead-reckoning extrapolation and interactive geospatial controls.

---

# Features

## Real-Time Telemetry Streaming

- Websocket-based AIS and ADS-B streaming
- Snapshot playback and time-based simulation
- Server-side filtering and viewport-based queries
- Smooth client-side extrapolation between updates

## 3D Geospatial Visualization

- CesiumJS globe rendering
- Real-time aircraft and vessel tracking
- Dynamic camera controls and entity selection
- Layer-based map rendering
- Arc-based route visualization
- Interactive labels and metadata overlays

## Simulation & Playback

- Historical playback support
- Adjustable playback speed
- Dead-reckoning position extrapolation
- Continuous motion smoothing between telemetry snapshots
- Time-synchronized aircraft and vessel simulation

## Backend Services

- FastAPI REST + websocket architecture
- Streaming telemetry endpoints
- Snapshot caching and replay logic
- Bounding-box spatial filtering
- Support for large telemetry datasets

---

# Tech Stack

## Frontend

- React
- TypeScript
- CesiumJS
- Resium
- Redux Toolkit
- RTK Query
- Vite

## Backend

- FastAPI
- Python
- WebSockets
- PostgreSQL
- PostGIS

---

# Data Sources

This project uses publicly available maritime and aviation telemetry data.

## AIS Maritime Data

AIS (Automatic Identification System) vessel telemetry is sourced from public AIS aggregation services and historical maritime datasets used for simulation and visualization purposes.

## ADS-B Aviation Data

ADS-B (Automatic Dependent Surveillance–Broadcast) aircraft telemetry is sourced from public aviation tracking feeds and historical ADS-B datasets.

## Cesium Ion

3D globe rendering, terrain, and imagery services are powered by CesiumJS and Cesium Ion.

## OpenStreetMap

Geospatial search and location services may utilize OpenStreetMap and related open geospatial data providers.

---

# License

MIT License

---

# Author

Dan Sapp
