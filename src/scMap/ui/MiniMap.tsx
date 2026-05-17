import { useContext, useEffect, useMemo, type ReactNode } from "react";
import { Viewer, useCesium } from "resium";
import { Color, IonImageryProvider } from "cesium";
import { CameraContext } from "@/map/types";
import MainViewRectangle from "@/map/widgets/MainViewRectangle";

const MiniMapInitializer = () => {
  const { viewer } = useCesium();
  const { overviewViewerRef, mainViewerRef } = useContext(CameraContext);

  useEffect(() => {
    if (!viewer) return;
    overviewViewerRef.current = viewer;
  }, [viewer, overviewViewerRef]);

  useEffect(() => {
    if (!viewer) return;

    const position = mainViewerRef.current?.camera.position;
    if (position) {
      viewer.camera.setView({
        destination: position.clone(),
      });
    }

    const controller = viewer.scene.screenSpaceCameraController;
    controller.enableRotate = false;
    controller.enableZoom = false;
    controller.enableTilt = false;
    controller.enableTranslate = false;
    controller.enableLook = false;

    // viewer.scene.morphTo2D(0);
    viewer.useDefaultRenderLoop = true;
    viewer.scene.requestRenderMode = false;
    viewer.resolutionScale = 1.0;
    viewer.scene.backgroundColor = Color.BLACK;
    viewer.scene.globe.baseColor = Color.BLACK;
  }, [viewer, mainViewerRef]);

  useEffect(() => {
    if (!viewer) return;

    let isCancelled = false;

    IonImageryProvider.fromAssetId(2).then((provider) => {
      if (isCancelled) return;

      viewer.imageryLayers.removeAll();
      viewer.imageryLayers.addImageryProvider(provider);
    });

    return () => {
      isCancelled = true;
    };
  }, [viewer]);

  return null;
};

const MiniMap = ({ children }: { children?: ReactNode | ReactNode[] }) => {
  const contextOptions = useMemo(() => ({ webgl: { alpha: true } }), []);
  return (
    <Viewer
      full
      contextOptions={contextOptions}
      baseLayerPicker={false}
      baseLayer={false}
      timeline={false}
      geocoder={false}
      homeButton={false}
      sceneModePicker={false}
      animation={false}
      fullscreenButton={false}
      navigationHelpButton={false}
      selectionIndicator={false}
      infoBox={false}
    >
      <MiniMapInitializer />
      <MainViewRectangle />
      {children}
    </Viewer>
  );
};

export default MiniMap;
