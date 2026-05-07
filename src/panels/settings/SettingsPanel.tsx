import { Button } from "@/components/ui/button";
import LayerSwitcher from "./LayerSwitcher";
import OverviewMapSwitch from "./OverviewMapSwitch";
import PipMapSwitch from "./PipMapSwitch";
import useSettings from "./useSettings";

const SettingsPanel = () => {
  const settingsState = useSettings();
  return (
    <div className="w-full flex flex-col gap-4 md:gap-12 p-8">
      <LayerSwitcher layer={settingsState.layer} setLayer={settingsState.handleChangeLayer} />
      <OverviewMapSwitch
        showOverviewMap={settingsState.showOverviewMap}
        setShowOverviewMap={settingsState.handleToggleOverviewMap}
      />
      <PipMapSwitch
        showPipMap={settingsState.showPipMap}
        setShowPipMap={settingsState.handleTogglePipMap}
        isPip2={false}
      />
      <PipMapSwitch
        showPipMap={settingsState.showPipMap2}
        setShowPipMap={settingsState.handleTogglePipMap2}
        isPip2={true}
      />
      <Button onClick={settingsState.handleResetToDefault}>Reset to Default</Button>
    </div>
  );
};

export default SettingsPanel;
