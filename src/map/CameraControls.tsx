import { useCesium } from "resium";
import { Cartesian3 } from "cesium";
import { Button } from "@/components/ui/button";
import { ButtonTooltip } from "@/components/ui/tooltip";
import { Plus, Minus, Camera, ListPlus } from "lucide-react";
import useLocalStorage from "use-local-storage";
import { useContext } from "react";
import { CameraContext } from "./types";
import { defaultMainView, defaultPipView, defaultPipView2 } from "./useMapState";

const CameraControls = ({ takeScreenshot, sendPrompt }: { takeScreenshot: () => void; sendPrompt: () => void }) => {
  const [_initMainView, setInitMainView] = useLocalStorage("main-cam-init", defaultMainView);
  const [_initPipView, setInitPipView] = useLocalStorage("pip-cam-init", defaultPipView);
  const [_initPipView2, setInitPipView2] = useLocalStorage("pip-2-cam-init", defaultPipView2);
  const { viewer } = useCesium();
  const { pipViewerRef, pipViewer2Ref } = useContext(CameraContext);

  const zoomIn = () => viewer?.camera?.zoomIn(150_000);
  const zoomOut = () => viewer?.camera?.zoomOut(150_000);

  const reset = () => {
    setInitMainView(defaultMainView);
    setInitPipView(defaultPipView);
    setInitPipView2(defaultPipView2);
    viewer?.camera?.flyTo({
      destination: Cartesian3.fromDegrees(defaultMainView.lon, defaultMainView.lat, defaultMainView.height),
      orientation: {
        heading: defaultMainView.heading,
        pitch: defaultMainView.pitch,
        roll: defaultMainView.roll,
      },
    });
    pipViewerRef.current?.camera?.flyTo({
      destination: Cartesian3.fromDegrees(defaultPipView.lon, defaultPipView.lat, defaultPipView.height),
      orientation: {
        heading: defaultPipView.heading,
        pitch: defaultPipView.pitch,
        roll: defaultPipView.roll,
      },
    });
    pipViewer2Ref.current?.camera?.flyTo({
      destination: Cartesian3.fromDegrees(defaultPipView2.lon, defaultPipView2.lat, defaultPipView2.height),
      orientation: {
        heading: defaultPipView2.heading,
        pitch: defaultPipView2.pitch,
        roll: defaultPipView2.roll,
      },
    });
  };

  return (
    <div className="absolute bottom-1 right-1 z-99 flex flex-row gap-2">
      <Button size="icon" onClick={zoomIn}>
        <Plus />
      </Button>
      <Button size="icon" onClick={zoomOut}>
        <Minus />
      </Button>
      <Button size="default" onClick={reset}>
        Reset
      </Button>
      <ButtonTooltip content="Download Image">
        <Button size="default" onClick={takeScreenshot}>
          <Camera />
        </Button>
      </ButtonTooltip>
      <ButtonTooltip content="Send to Report">
        <Button size="default" onClick={sendPrompt}>
          <ListPlus />
        </Button>
      </ButtonTooltip>
    </div>
  );
};

export default CameraControls;
