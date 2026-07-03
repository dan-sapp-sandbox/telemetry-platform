# Real-time 3D Geospatial Telemetry & Ocean Visualization Platform

A real-time geospatial visualization platform for streaming, replaying, and analyzing maritime AIS, aviation ADS-B, and global ocean surface current data in a 3D globe environment.

The platform combines a FastAPI backend, websocket-based telemetry streaming, Cesium-powered visualization, and tile rendering to simulate live vessel and aircraft movement while displaying global ocean circulation through animated vector fields.

---

# Features

## Real-Time Telemetry Streaming

- Websocket-based AIS and ADS-B streaming
- Snapshot playback and time-based simulation
- Server-side filtering and viewport-based queries
- Smooth client-side interpolation between updates

## Ocean Surface Current Visualization

- Global ocean surface current vector field
- Tile pipeline for efficient rendering
- Colorized velocity magnitude gradients
- Viewport-based tile loading
- Supports large-scale oceanographic datasets

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

- FastAPI (Python)
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

## Ocean Surface Currents

Global ocean surface current vectors are generated from NOAA OSCAR (Ocean Surface Current Analyses Real-time) datasets and converted into tiles for efficient visualization and interactive exploration.

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
