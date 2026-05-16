import { ExternalLink, Download } from "lucide-react";
import useAboutTab from "./useAboutTab";

const AboutTab = () => {
  const { handleDownloadResume, handleOpenLinkedInLink, handleOpenGithubLink } = useAboutTab();
  return (
    <div className="flex h-full">
      <div className="flex flex-col gap-2 w-1/2">
        <div className="flex gap-2">
          {/* <img src="/me2.png" className="h-16 rounded" alt="profile pic" /> */}
          <span className="text-lg font-bold text-(--text)">Hi, I'm Dan Sapp.</span>
        </div>
        <span>
          I build interactive web applications focused on visualization, realtime data, and thoughtful user experience.
        </span>
      </div>
      <div className="flex flex-col w-1/2 p-1 gap-2">
        <div
          className="flex justify-end items-center gap-2 text-(--text)/80 hover:text-(--text-hover) cursor-pointer"
          onClick={() => handleDownloadResume()}
        >
          <span className="text-base">Download Resume</span>
          <Download className="size-4" />
        </div>
        <div
          className="flex justify-end items-center gap-2 text-(--text)/80 hover:text-(--text-hover) cursor-pointer"
          onClick={() => handleOpenLinkedInLink()}
        >
          <span className="text-base">LinkedIn</span>
          <ExternalLink className="size-4" />
        </div>
        <div
          className="flex justify-end items-center gap-2 text-(--text)/80 hover:text-(--text-hover) cursor-pointer"
          onClick={() => handleOpenGithubLink()}
        >
          <span className="text-base">GitHub Repo</span>
          <ExternalLink className="size-4" />
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
