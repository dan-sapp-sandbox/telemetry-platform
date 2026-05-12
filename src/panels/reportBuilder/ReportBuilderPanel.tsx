import ReportBuilder from "./ReportBuilder";
import { Button } from "@/components/ui/button";

const ReportBuilderPanel = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="text-2xl font-bold">Report Builder</div>
      <div>
        <Button>Add Text Section</Button>
        <Button>Clear Report</Button>
      </div>
      <ReportBuilder />
    </div>
  );
};

export default ReportBuilderPanel;
