import { useEffect } from "react";
import { UrlTemplateImageryProvider } from "cesium";
import { useCesium } from "resium";

const DataLayer = () => {
  const { viewer } = useCesium();
  if (!viewer) return null;

  const TILE_BASE_URL = "https://vtumnamsiwcnmoysyqzi.supabase.co/storage/v1/object/public/tiles";
  const populationLayer = new UrlTemplateImageryProvider({
    url: `${TILE_BASE_URL}/population/{z}/{x}/{y}.png`,
    minimumLevel: 0,
    maximumLevel: 5,
  });

  useEffect(() => {
    viewer.imageryLayers.addImageryProvider(populationLayer);
  }, [viewer]);

  return null;
};

export default DataLayer;
