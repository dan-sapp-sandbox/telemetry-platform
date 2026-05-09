import ReportBuilder from "../../panels/reportBuilder/ReportBuilder";
import Section from "../Section";

const ReportBuilderSection = () => {
  const config = {
    githubURL: "https://github.com/dan-sapp-sandbox/sandbox/tree/main/src/sections/reportBuilder",
    demoURL: "/report-builder",
    title: "Report Builder",
    description: "Used in conjunction with other tools to generate a customizable report with a live pdf preview.",
    features: [
      "Expand Sections to use Rich Text Editor",
      "Drag and Drop to reorder sections",
      "Live PDF Preview updates on change",
    ],
    usedPreviously: [
      { where: "EarthDaily Federal", what: "Report Builder" },
      { where: "Stellar", what: "Boat Rental Scheduling App" },
    ],
    isReversed: true,
  };

  return (
    <Section config={config}>
      <div className="bg-(--card-section-text-bg) h-full w-full rounded-2xl">
        <ReportBuilder />
      </div>
    </Section>
  );
};

export default ReportBuilderSection;
