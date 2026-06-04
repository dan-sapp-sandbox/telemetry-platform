import { ExternalLink, Download } from "lucide-react";
import useAboutTab from "./useAboutTab";

const AboutTab = () => {
  const { handleDownloadResume, handleOpenLinkedInLink, handleOpenGithubLink } = useAboutTab();
  return (
    <div className="flex h-full p-2">
      <div className="flex flex-col md:gap-2 w-3/5">
        <div className="flex gap-2">
          <span className="text-sm md:text-lg font-bold text-(--text)/80">Hi, I'm Dan Sapp.</span>
        </div>
        <span className="text-xs md:text-sm xl:text-base text-(--text)/80">
          I'm a Senior Software Engineer focused on real-time tracking systems, 3D globe visualization, and spatial
          analytics. My work combines TypeScript, React, Cesium, FastAPI, and PostGIS to build interactive geospatial
          applications.
        </span>
      </div>
      <div className="flex flex-col w-2/5 p-1 gap-3">
        <div
          className="flex justify-end items-center gap-2 text-(--text)/80 hover:text-(--text-hover) cursor-pointer"
          onClick={() => handleDownloadResume()}
        >
          <span className="text-xs md:text-base">Download Resume</span>
          <Download className="size-3 md:size-4" />
        </div>
        <div
          className="flex justify-end items-center gap-2 text-(--text)/80 hover:text-(--text-hover) cursor-pointer"
          onClick={() => handleOpenLinkedInLink()}
        >
          <span className="text-xs md:text-base">LinkedIn</span>
          <ExternalLink className="size-3 md:size-4" />
        </div>
        <div
          className="flex justify-end items-center gap-2 text-(--text)/80 hover:text-(--text-hover) cursor-pointer"
          onClick={() => handleOpenGithubLink()}
        >
          <span className="text-xs md:text-base">GitHub</span>
          <ExternalLink className="size-3 md:size-4" />
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
