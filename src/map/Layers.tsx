import { useEffect, useMemo, useRef } from "react";
import { useCesium } from "resium";
import { OpenStreetMapImageryProvider, IonImageryProvider, UrlTemplateImageryProvider, ImageryLayer } from "cesium";
import { useSelector } from "react-redux";
import { type mapState } from "@/store/slices/mapSlice";

const TILE_BASE_URL = "https://vtumnamsiwcnmoysyqzi.supabase.co/storage/v1/object/public/tiles";

const Layers = () => {
  const { layer, dataLayer } = useSelector((state: { map: mapState }) => state.map);

  const { viewer } = useCesium();
  const satelliteRef = useRef<Promise<IonImageryProvider> | null>(null);
  const baseLayerRef = useRef<ImageryLayer | null>(null);
  const populationLayerRef = useRef<ImageryLayer | null>(null);

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

    const applyBaseLayer = async () => {
      let provider;

      switch (layer) {
        case "satellite":
          provider = await satelliteRef.current!;
          break;

        case "esriSat":
          provider = providers.esriSat;
          break;

        case "carto-light":
          provider = providers["carto-light"];
          break;

        case "carto-dark":
          provider = providers["carto-dark"];
          break;

        case "carto-voyager":
          provider = providers["carto-voyager"];
          break;

        case "osm":
        default:
          provider = providers.osm;
      }

      if (cancelled) return;

      const layers = viewer.imageryLayers;

      if (baseLayerRef.current) {
        layers.remove(baseLayerRef.current);
      }

      const newLayer = layers.addImageryProvider(provider, 0);

      newLayer.alpha = 1.0;

      baseLayerRef.current = newLayer;

      viewer.scene.requestRender();
    };

    applyBaseLayer();

    return () => {
      cancelled = true;
    };
  }, [viewer, layer, providers]);

  useEffect(() => {
    if (!viewer) return;

    const layers = viewer.imageryLayers;

    // remove old overlay
    if (populationLayerRef.current) {
      layers.remove(populationLayerRef.current);
      populationLayerRef.current = null;
    }

    // reset base alpha
    if (baseLayerRef.current) {
      baseLayerRef.current.alpha = 1.0;
    }

    // add overlay if enabled
    if (dataLayer === "population-density") {
      if (baseLayerRef.current) {
        baseLayerRef.current.alpha = 0.75;
      }

      const overlay = layers.addImageryProvider(providers.populationDensity);

      overlay.alpha = 0.8;

      populationLayerRef.current = overlay;
    }

    viewer.scene.requestRender();
  }, [viewer, dataLayer, providers]);

  return null;
};

export default Layers;
