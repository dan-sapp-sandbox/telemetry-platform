import { useContext, useState } from "react";
import { useSendCommandPromptMutation } from "@/store/services/api";
import { CameraContext } from "@/map/types";
import { Cartesian3 } from "cesium";

const useAITab = () => {
  const { mainViewerRef } = useContext(CameraContext);
  const [toolActions, setToolActions] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [sendCommandPrompt, { isLoading }] = useSendCommandPromptMutation();
  const viewer = mainViewerRef.current;

  const handleSendCommandPrompt = async () => {
    setToolActions([]);
    const result = await sendCommandPrompt({
      prompt,
    }).unwrap();
    setPrompt("");
    let toolArray = [];
    if (result.action === "center_map") {
      toolArray.push(`Center Map at ${result.args.query} (${result.args.lon}, ${result.args.lat})`);
      if (!viewer) return;
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(result.args.lon, result.args.lat, result.args.camera_altitude_m),
      });
    }
    setToolActions(toolArray);
  };

  return { handleSendCommandPrompt, prompt, setPrompt, isLoading, toolActions };
};

export default useAITab;
