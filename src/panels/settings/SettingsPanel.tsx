import { Button } from "@/components/ui/button";
import LayerSwitcher from "./LayerSwitcher";
import OverviewMapSwitch from "./OverviewMapSwitch";
import PipMapSwitch from "./PipMapSwitch";
import useSettings from "./useSettings";
import { Switch } from "@/components/ui/switch";

const SettingsPanel = () => {
  const settingsState = useSettings();
  return (
    <div className="w-full flex flex-col gap-4 md:gap-12 p-8">
      <div className="text-2xl font-bold">Settings</div>
      <LayerSwitcher layer={settingsState.layer} setLayer={settingsState.handleChangeLayer} />
      <div className="flex items-center gap-4">
        <Switch checked={settingsState.showOverviewMap} onCheckedChange={settingsState.handleToggleOverviewMap} />
        <span className="text-(--text) font-bold">Show Overview Map</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch checked={settingsState.showPipMap} onCheckedChange={settingsState.handleTogglePipMap} />
        <span className="text-(--text) font-bold">Show PIP Map</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch checked={settingsState.showPipMap2} onCheckedChange={settingsState.handleTogglePipMap} />
        <span className="text-(--text) font-bold">Show PIP Map 2</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch checked={settingsState.showPipMap2} onCheckedChange={settingsState.handleTogglePipMap} />
        <span className="text-(--text) font-bold">Show Labels</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch checked={settingsState.showPipMap2} onCheckedChange={settingsState.handleTogglePipMap} />
        <span className="text-(--text) font-bold">Show Vessels</span>
      </div>
      <Button onClick={settingsState.handleResetToDefault}>Reset to Default</Button>
    </div>
  );
};

export default SettingsPanel;
