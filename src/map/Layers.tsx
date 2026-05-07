import type { ILayer } from "@/store/slices/mapSlice";
import { useMemo } from "react";
import { ImageryLayer } from "resium";
import { OpenStreetMapImageryProvider, IonImageryProvider, UrlTemplateImageryProvider } from "cesium";

const Layers = ({ layer }: { layer: ILayer }) => {
  const osmProvider = useMemo(() => new OpenStreetMapImageryProvider({ url: "https://tile.openstreetmap.org/" }), []);
  const esriSat = useMemo(
    () =>
      new UrlTemplateImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      }),
    [],
  );
  const cartoLight = useMemo(
    () => new UrlTemplateImageryProvider({ url: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" }),
    [],
  );
  const cartoDark = useMemo(
    () => new UrlTemplateImageryProvider({ url: "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" }),
    [],
  );
  const cartoVoyager = useMemo(
    () =>
      new UrlTemplateImageryProvider({ url: "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png" }),
    [],
  );

  const satProvider = useMemo(() => IonImageryProvider.fromAssetId(2), []);

  const provider = useMemo(() => {
    switch (layer) {
      case "esriSat":
        return esriSat;
      case "osm":
        return osmProvider;
      case "satellite":
        return satProvider;
      case "carto-light":
        return cartoLight;
      case "carto-dark":
        return cartoDark;
      case "carto-voyager":
        return cartoVoyager;
      default:
        return osmProvider;
    }
  }, [layer, esriSat, osmProvider, satProvider, cartoLight, cartoDark, cartoVoyager]);

  if (!provider) return null;

  return <ImageryLayer imageryProvider={provider} />;
};

export default Layers;
