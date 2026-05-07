import Section from "../sections/Section";
import MapApp from "./MapApp";

const MapSection = () => {
  const config = {
    githubURL: "https://github.com/dan-sapp-sandbox/sandbox/tree/main/src/sections/map",
    demoURL: "/map",
    title: "Geospatial Visualization Tool",
    description:
      "A tool used by Military Geospatial Intelligence Analysts to create content for reports regarding their Area of Interest.",
    features: [
      "Multi-map synchronization: Main map, overview map, and picture-in-picture maps share camera state",
      "Draggable map widgets with dynamic layout",
      "Camera bounds visualization between map views",
      "Configurable base layer",
      "Download map image or send directly to Report Builder",
      // "Interactive drawing tools for points, lines, and polygons (WIP)",
      // "GeoJSON import/export pipeline (WIP)",
      // "Map icon placement system (WIP)",
    ],
    usedPreviously: [
      {
        where: "EarthDaily Federal",
        what: "Search and Rescue mission management system",
      },
      {
        where: "EarthDaily Federal",
        what: "Military geospatial intelligence platform",
      },
    ],
    tech: ["React", "TypeScript", "CesiumJS", "Resium", "GeoJSON"],
  };

  return (
    <Section config={config}>
      <MapApp />
    </Section>
  );
};

export default MapSection;
