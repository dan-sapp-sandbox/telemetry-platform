import { ExternalLink, Download } from "lucide-react";

const IntroPanel = ({ openGuide }: { openGuide: () => void }) => {
  const githubURL = "https://github.com/dan-sapp-sandbox";
  const linkedInURL = "https://www.linkedin.com/in/dan-sapp-744145b6/";
  const handleOpenGithubLink = () => {
    window.open(githubURL, "_blank", "noopener,noreferrer");
  };
  const handleOpenLinkedInLink = () => {
    window.open(linkedInURL, "_blank", "noopener,noreferrer");
  };
  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = `/Dan Sapp Resume.pdf`;
    link.download = "Dan Sapp Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="w-full flex flex-row gap-4 md:gap-12 p-8">
      <div className="h-full flex-1 flex flex-col justify-between overflow-hidden gap-4">
        <div className="flex flex-col gap-3 md:gap-8">
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
            onClick={() => handleDownloadResume()}
          >
            <span className="text-base md:text-xl">Download Resume</span>
            <Download />
          </div>
          <div
            className="w-fit flex items-center md:gap-4 text-(--text) hover:text-(--text-hover) cursor-pointer"
            onClick={() => handleOpenLinkedInLink()}
          >
            <span className="text-base md:text-xl">LinkedIn</span>
            <ExternalLink />
          </div>
          <div
            className="w-fit flex items-center md:gap-4 text-(--text) hover:text-(--text-hover) cursor-pointer"
            onClick={() => handleOpenGithubLink()}
          >
            <span className="text-base md:text-xl">GitHub</span>
            <ExternalLink />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPanel;
