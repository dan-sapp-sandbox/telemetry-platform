import { useContext, useState } from "react";
import { useSendCommandPromptMutation } from "@/store/services/api";
import { CameraContext } from "@/map/types";
import { Cartesian3 } from "cesium";
import { setDataLayer } from "@/store/slices/mapSlice";
import { useDispatch } from "react-redux";

const useAITab = () => {
  const dispatch = useDispatch();
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
    const toolArray = result.actions.reduce<string[]>((acc, action) => {
      if (action.action === "center_map") {
        if (!viewer) return acc;
        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(action.args.lon, action.args.lat, action.args.camera_altitude_m),
        });
        return [...acc, `Center Map at ${action.args.query} (${action.args.lon}, ${action.args.lat})`];
      }
      if (action.action === "show_vessel_layer") {
        dispatch(setDataLayer("vessels"));
        return [...acc, `Activate Vessel Data Layer`];
      } else if (action.action === "show_aircraft_layer") {
        dispatch(setDataLayer("aircraft"));
        return [...acc, `Activate Aircraft Data Layer`];
      }
      return acc;
    }, []);
    setToolActions(toolArray);
  };

  return { handleSendCommandPrompt, prompt, setPrompt, isLoading, toolActions };
};

export default useAITab;
