import { Switch } from "@/components/ui/switch";

interface Props {
  showPipMap: boolean;
  setShowPipMap: (show: boolean) => void;
  isPip2: boolean;
}
const PipMapSwitch = ({ showPipMap, setShowPipMap, isPip2 }: Props) => {
  const label = isPip2 ? "Show Pip Map 2" : "Show Pip Map";
  return (
    <div className="flex items-center gap-4">
      <Switch checked={showPipMap} onCheckedChange={(checked: boolean) => setShowPipMap(checked)} />
      <span className="text-(--text) font-bold">{label}</span>
    </div>
  );
};

export default PipMapSwitch;
