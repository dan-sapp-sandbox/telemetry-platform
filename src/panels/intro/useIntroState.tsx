interface IIntroState {
  handleOpenGithubLink: () => void;
  handleOpenLinkedInLink: () => void;
  handleDownloadResume: () => void;
}

const useIntroState = (): IIntroState => {
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

  return {
    handleOpenGithubLink,
    handleOpenLinkedInLink,
    handleDownloadResume,
  };
};

export default useIntroState;
