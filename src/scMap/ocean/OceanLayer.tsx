import { useEffect, useRef } from "react";
import { useCesium } from "resium";
import { Cartesian3, Color, PolylineArrowMaterialProperty, Math as CesiumMath } from "cesium";
import { useSelector } from "react-redux";
import { type mapState } from "@/store/slices/mapSlice";

const TILE_BASE_URL = "https://vtumnamsiwcnmoysyqzi.supabase.co/storage/v1/object/public/tiles";

const key = (z: number, x: number, y: number) => `${z}/${x}/${y}`;

const getColorFromMagnitude = (length: number) => {
  if (length <= 0.1) return Color.RED;
  if (length <= 0.2) return Color.ORANGERED;
  if (length <= 0.3) return Color.ORANGE;
  if (length <= 0.4) return Color.YELLOW;
  if (length <= 0.5) return Color.YELLOWGREEN;
  if (length <= 0.6) return Color.GREEN;
  if (length <= 0.75) return Color.CYAN;
  if (length <= 0.9) return Color.BLUE;
  if (length <= 1.1) return Color.BLUEVIOLET;
  return Color.VIOLET;
};

const lonToTileX = (lon: number, z: number) => {
  const n = 1 << z;
  return Math.floor(((lon + 180) / 360) * n);
};

const latToTileY = (lat: number, z: number) => {
  const n = 1 << z;

  const latRad = (lat * Math.PI) / 180;

  return Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
};

const OceanLayer = () => {
  const { viewer } = useCesium();
  const { dataLayer } = useSelector((state: { map: mapState }) => state.map);

  const cacheRef = useRef<Map<string, any>>(new Map());

  const activeTilesRef = useRef<Set<string>>(new Set());
  const tileEntitiesRef = useRef<Map<string, any[]>>(new Map());

  const updateLockRef = useRef(false);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (!viewer || dataLayer !== "ocean") return;

    let cancelled = false;

    const getZoomFromCamera = () => {
      const height = viewer.camera.positionCartographic.height;
      const zoom = Math.log2(40_000_000 / height);
      return Math.max(0, Math.min(5, zoom));
    };

    const getVisibleTiles = (z: number) => {
      const camera = viewer.camera.positionCartographic;

      const lon = CesiumMath.toDegrees(camera.longitude);
      const lat = CesiumMath.toDegrees(camera.latitude);

      const centerX = lonToTileX(lon, z);
      const centerY = latToTileY(lat, z);

      const range = 1;

      const tiles = [];

      const max = 1 << z;

      for (let dx = -range; dx <= range; dx++) {
        for (let dy = -range; dy <= range; dy++) {
          const x = centerX + dx;
          const y = centerY + dy;

          if (x < 0 || x >= max) continue;
          if (y < 0 || y >= max) continue;

          tiles.push({
            z,
            x,
            y,
          });
        }
      }

      return tiles;
    };

    const fetchTile = async (z: number, x: number, y: number) => {
      const k = key(z, x, y);

      const cached = cacheRef.current.get(k);
      if (cached) return cached;

      const tile = await fetch(`${TILE_BASE_URL}/ocean/current/${z}/${x}/${y}.json`).then((r) => r.json());

      cacheRef.current.set(k, tile);
      return tile;
    };

    const renderTile = (tile: any, z: number) => {
      const size = tile.resolution;

      const stride = 1;

      const entities: any[] = [];

      for (let i = 0; i < size; i += stride) {
        for (let j = 0; j < size; j += stride) {
          const u = tile.u[i][j];
          const v = tile.v[i][j];

          const lon = tile.west + ((j + 0.5) / size) * (tile.east - tile.west);

          const lat = tile.north - ((i + 0.5) / size) * (tile.north - tile.south);

          const endLon = lon + u / 2;
          const endLat = lat + v / 2;

          const start = Cartesian3.fromDegrees(lon, lat);
          const end = Cartesian3.fromDegrees(endLon, endLat);
          const magnitude = Math.hypot(u, v);

          const entityColor = getColorFromMagnitude(magnitude);
          const entity = viewer.entities.add({
            polyline: {
              positions: [start, end],
              width: 6,
              material: new PolylineArrowMaterialProperty(entityColor),
            },
          });

          entities.push(entity);
        }
      }

      return entities;
    };

    const update = async () => {
      if (cancelled) return;

      const now = performance.now();

      if (now - lastUpdateRef.current < 150) return;
      lastUpdateRef.current = now;

      if (updateLockRef.current) return;
      updateLockRef.current = true;

      try {
        const Z = Math.floor(getZoomFromCamera());

        const tiles = getVisibleTiles(Z);
        const newActive = new Set<string>();

        for (const t of tiles) {
          const k = key(t.z, t.x, t.y);
          newActive.add(k);

          if (activeTilesRef.current.has(k)) continue;

          const tile = await fetchTile(t.z, t.x, t.y);
          if (cancelled) return;

          const entities = renderTile(tile, Z);
          tileEntitiesRef.current.set(k, entities);
        }

        for (const oldKey of activeTilesRef.current) {
          if (!newActive.has(oldKey)) {
            const ents = tileEntitiesRef.current.get(oldKey);

            if (ents) {
              for (const e of ents) {
                viewer.entities.remove(e);
              }
            }

            tileEntitiesRef.current.delete(oldKey);
          }
        }

        activeTilesRef.current = newActive;
        viewer.scene.requestRender();
      } finally {
        updateLockRef.current = false;
      }
    };

    update();

    viewer.camera.moveEnd.addEventListener(update);

    return () => {
      cancelled = true;
      viewer.camera.moveEnd.removeEventListener(update);

      for (const ents of tileEntitiesRef.current.values()) {
        for (const e of ents) {
          viewer.entities.remove(e);
        }
      }

      tileEntitiesRef.current.clear();
      activeTilesRef.current.clear();
    };
  }, [viewer, dataLayer]);

  return null;
};

export default OceanLayer;
