import { ExternalLink, Download } from "lucide-react";
import useAboutTab from "./useAboutTab";

const AboutTab = () => {
  const { handleDownloadResume, handleOpenLinkedInLink, handleOpenGithubLink } = useAboutTab();
  return (
    <div className="flex h-full p-2">
      <div className="flex flex-col gap-2 w-1/2">
        <div className="flex gap-2">
          <span className="md:text-lg font-bold text-(--text)">Hi, I'm Dan Sapp.</span>
        </div>
        <span className="text-sm text-(--text)">
          I'm a Geospatial Software Engineer focused on Typescript, React, Cesium, FastAPI, and postGIS.
        </span>
      </div>
      <div className="flex flex-col w-1/2 p-1 gap-2">
        <div
          className="flex justify-end items-center gap-2 text-(--text)/80 hover:text-(--text-hover) cursor-pointer"
          onClick={() => handleDownloadResume()}
        >
          <span className="text-sm md:text-base">Download Resume</span>
          <Download className="size-4" />
        </div>
        <div
          className="flex justify-end items-center gap-2 text-(--text)/80 hover:text-(--text-hover) cursor-pointer"
          onClick={() => handleOpenLinkedInLink()}
        >
          <span className="text-sm md:text-base">LinkedIn</span>
          <ExternalLink className="size-4" />
        </div>
        <div
          className="flex justify-end items-center gap-2 text-(--text)/80 hover:text-(--text-hover) cursor-pointer"
          onClick={() => handleOpenGithubLink()}
        >
          <span className="text-sm md:text-base">GitHub Repo</span>
          <ExternalLink className="size-4" />
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
