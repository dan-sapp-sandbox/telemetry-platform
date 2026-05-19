import { useContext, useState } from "react";
import { useSendCommandPromptMutation } from "@/store/services/api";
import { CameraContext } from "@/map/types";
import { Cartesian3 } from "cesium";

const useAITab = () => {
  const { mainViewerRef } = useContext(CameraContext);
  const [prompt, setPrompt] = useState<string>("");
  const [sendCommandPrompt, { isLoading }] = useSendCommandPromptMutation();
  const viewer = mainViewerRef.current;

  const handleSendCommandPrompt = async () => {
    const result = await sendCommandPrompt({
      prompt,
    }).unwrap();
    console.log("result", result);
    setPrompt("");
    if (result.action === "center_map") {
      if (!viewer) return;
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(result.args.lon, result.args.lat, 2_000_000),
      });
    }
  };
  return { handleSendCommandPrompt, prompt, setPrompt, isLoading };
};

export default useAITab;
