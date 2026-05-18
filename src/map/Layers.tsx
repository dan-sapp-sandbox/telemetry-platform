import { useEffect, useMemo, useRef } from "react";
import { useCesium } from "resium";
import { OpenStreetMapImageryProvider, IonImageryProvider, UrlTemplateImageryProvider } from "cesium";
import { useSelector } from "react-redux";
import { type mapState } from "@/store/slices/mapSlice";

const TILE_BASE_URL = "https://vtumnamsiwcnmoysyqzi.supabase.co/storage/v1/object/public/tiles";

const Layers = () => {
  const { layer } = useSelector((state: { map: mapState }) => state.map);

  const { viewer } = useCesium();
  const satelliteRef = useRef<Promise<IonImageryProvider> | null>(null);

  const providers = useMemo(
    () => ({
      osm: new OpenStreetMapImageryProvider({
        url: "https://tile.openstreetmap.org/",
      }),

      esriSat: new UrlTemplateImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      }),

      "carto-light": new UrlTemplateImageryProvider({
        url: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      }),

      "carto-dark": new UrlTemplateImageryProvider({
        url: "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      }),

      "carto-voyager": new UrlTemplateImageryProvider({
        url: "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
      }),

      populationDensity: new UrlTemplateImageryProvider({
        url: `${TILE_BASE_URL}/population/{z}/{x}/{y}.png`,
        minimumLevel: 0,
        maximumLevel: 5,
      }),
    }),
    [],
  );

  useEffect(() => {
    if (!satelliteRef.current) {
      satelliteRef.current = IonImageryProvider.fromAssetId(2);
    }
  }, []);

  useEffect(() => {
    if (!viewer) return;

    let cancelled = false;

    const applyLayers = async () => {
      let baseProvider;

      switch (layer) {
        case "satellite":
        case "population-density":
          baseProvider = await satelliteRef.current!;
          break;

        case "esriSat":
          baseProvider = providers.esriSat;
          break;

        case "carto-light":
          baseProvider = providers["carto-light"];
          break;

        case "carto-dark":
          baseProvider = providers["carto-dark"];
          break;

        case "carto-voyager":
          baseProvider = providers["carto-voyager"];
          break;

        case "osm":
        default:
          baseProvider = providers.osm;
      }

      if (cancelled) return;

      const layers = viewer.imageryLayers;

      // Remove old AFTER new provider exists
      layers.removeAll();

      const baseLayer = layers.addImageryProvider(baseProvider);
      baseLayer.alpha = 1.0;

      if (layer === "population-density") {
        baseLayer.alpha = 0.5;
        const overlay = layers.addImageryProvider(providers.populationDensity);
        overlay.alpha = 0.8;
      }

      viewer.scene.requestRender();
    };

    applyLayers();

    return () => {
      cancelled = true;
    };
  }, [viewer, layer, providers]);

  return null;
};

export default Layers;
