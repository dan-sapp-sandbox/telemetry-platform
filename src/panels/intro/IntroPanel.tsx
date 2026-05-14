import { ExternalLink, Download } from "lucide-react";
import useIntroState from "./useIntroState";

const IntroPanel = ({ openGuide }: { openGuide: () => void }) => {
  const introState = useIntroState();
  return (
    <div className="w-full flex flex-row gap-4 md:gap-12 p-2 md:p-4">
      <div className="h-full flex-1 flex flex-col justify-between overflow-hidden gap-4">
        <div className="flex flex-col gap-6 md:gap-8">
          <div>
            <img src="/me2.png" className="h-22 md:h-32 rounded-2xl" alt="profile pic" />
          </div>
          <div>
            <span className="text-xl md:text-4xl font-bold text-(--text)">Hi, I'm Dan Sapp.</span>
          </div>
          <div className="flex flex-col md:gap-4 text-(--text)">
            <span className="text-base md:text-xl">
              I build interactive web applications focused on visualization, realtime data, and thoughtful user
              experience.
            </span>
          </div>
          <div
            className="flex flex-col md:gap-4 text-(--text) hover:text-(--text-hover) cursor-pointer"
            onClick={openGuide}
          >
            <span className="text-base md:text-xl underline">App Guide</span>
          </div>
          <div
            className="w-fit flex items-center md:gap-4 text-(--text) hover:text-(--text-hover) cursor-pointer"
            onClick={() => introState.handleDownloadResume()}
          >
            <span className="text-base md:text-xl">Download Resume</span>
            <Download />
          </div>
          <div
            className="w-fit flex items-center md:gap-4 text-(--text) hover:text-(--text-hover) cursor-pointer"
            onClick={() => introState.handleOpenLinkedInLink()}
          >
            <span className="text-base md:text-xl">LinkedIn</span>
            <ExternalLink />
          </div>
          <div
            className="w-fit flex items-center md:gap-4 text-(--text) hover:text-(--text-hover) cursor-pointer"
            onClick={() => introState.handleOpenGithubLink()}
          >
            <span className="text-base md:text-xl">GitHub Repo</span>
            <ExternalLink />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPanel;
