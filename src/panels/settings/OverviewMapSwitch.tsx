import { Switch } from "@/components/ui/switch";

interface Props {
  showOverviewMap: boolean;
  setShowOverviewMap: (show: boolean) => void;
}
const OverviewMapSwitch = ({ showOverviewMap, setShowOverviewMap }: Props) => {
  return (
    <div className="flex items-center gap-4">
      <Switch checked={showOverviewMap} onCheckedChange={(checked: boolean) => setShowOverviewMap(checked)} />
      <span className="text-(--text) font-bold">Show Overview Map</span>
    </div>
  );
};

export default OverviewMapSwitch;
