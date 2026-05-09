import ReportBuilder from "./ReportBuilder";

const ReportBuilderPanel = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4 md:gap-12 p-4">
      <div className="text-2xl font-bold">Report Builder</div>
      <ReportBuilder />
    </div>
  );
};

export default ReportBuilderPanel;
