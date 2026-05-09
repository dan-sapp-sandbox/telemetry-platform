import { type JSX } from "react";
import type { RefObject } from "react";
import { Cartesian3, Viewer, Cartesian2, Color, VerticalOrigin, HeightReference } from "cesium";
import type { IWidgetState } from "../types";
import { Entity, LabelGraphics } from "resium";

const Labels = (
  <>
    <Entity position={Cartesian3.fromDegrees(51.1, 35.5)}>
      <LabelGraphics
        text="Tehran"
        font="28px sans-serif"
        fillColor={Color.BLUE}
        outlineColor={Color.BLACK}
        outlineWidth={24}
        verticalOrigin={VerticalOrigin.BOTTOM}
        heightReference={HeightReference.CLAMP_TO_GROUND}
        pixelOffset={new Cartesian2(-45, 0)}
        disableDepthTestDistance={Number.POSITIVE_INFINITY}
      />
    </Entity>
    <Entity position={Cartesian3.fromDegrees(56.8, 26.45)}>
      <LabelGraphics
        text="Strait of Hormuz"
        font="28px sans-serif"
        fillColor={Color.BLACK}
        outlineColor={Color.WHITE}
        outlineWidth={4}
        verticalOrigin={VerticalOrigin.BOTTOM}
        heightReference={HeightReference.CLAMP_TO_GROUND}
        pixelOffset={new Cartesian2(120, 0)}
        disableDepthTestDistance={Number.POSITIVE_INFINITY}
      />
    </Entity>
    <Entity
      polyline={{
        positions: [Cartesian3.fromDegrees(56.5, 26.4), Cartesian3.fromDegrees(57.0, 26.55)],
        width: 10,
        material: Color.BLACK,
        arcType: 0,
      }}
    />
    <Entity position={Cartesian3.fromDegrees(50.35, 29.0)}>
      <LabelGraphics
        text="Kharg Island"
        font="28px sans-serif"
        fillColor={Color.DARKMAGENTA}
        outlineColor={Color.WHITE}
        outlineWidth={1}
        verticalOrigin={VerticalOrigin.BOTTOM}
        heightReference={HeightReference.CLAMP_TO_GROUND}
        pixelOffset={new Cartesian2(100, 0)}
        disableDepthTestDistance={Number.POSITIVE_INFINITY}
      />
    </Entity>
  </>
);

export interface MapUtilProps {
  containerRef: RefObject<HTMLDivElement | null>;
  mainViewerRef: RefObject<Viewer | null>;
  overviewViewerRef: RefObject<Viewer | null>;
  pipViewerRef: RefObject<Viewer | null>;
  pipViewer2Ref: RefObject<Viewer | null>;
  widgetState: IWidgetState;
}
export interface IMapState {
  takeScreenshot: () => void;
  sendPrompt: () => Promise<void>;
  Labels: JSX.Element;
}

const useMapUtils = ({
  containerRef,
  mainViewerRef,
  overviewViewerRef,
  pipViewerRef,
  pipViewer2Ref,
  widgetState,
}: MapUtilProps): IMapState => {
  const tools = [
    {
      name: "createUser",
      description: "Create a user",
      parameters: {
        name: "string",
        email: "string",
      },
    },
  ];
  const sendPrompt = async () => {
    const res = await fetch("/api/command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "Create a user named Dan with email dan@test.com",
        tools,
      }),
    });

    const data = await res.json();
    console.log(data);
  };

  const takeScreenshot = async () => {
    if (!containerRef.current) return;

    const viewers = [
      { ref: mainViewerRef, state: null }, // main viewer fills the canvas
      { ref: overviewViewerRef, state: widgetState.overview },
      { ref: pipViewerRef, state: widgetState.pip },
      { ref: pipViewer2Ref, state: widgetState.pip2 },
    ];

    // Wait for all viewers to render
    for (const viewerObj of viewers) {
      const viewer = viewerObj.ref.current;
      if (!viewer) continue;
      await new Promise<void>((resolve) => {
        viewer.scene.render();
        requestAnimationFrame(() => resolve());
      });
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = containerRect.width;
    combinedCanvas.height = containerRect.height;
    const ctx = combinedCanvas.getContext("2d");
    if (!ctx) return;

    viewers.forEach((viewerObj, i) => {
      const viewer = viewerObj.ref.current;
      if (!viewer) return;
      const canvas = viewer.scene.canvas;

      if (viewerObj.state) {
        const { top, left, width, aspect } = viewerObj.state;
        const pxLeft = (left / 100) * containerRect.width;
        const pxTop = (top / 100) * containerRect.height;
        const pxWidth = (width / 100) * containerRect.width;
        const pxHeight = pxWidth / aspect;

        ctx.drawImage(canvas, pxLeft, pxTop, pxWidth, pxHeight);

        ctx.lineWidth = 1;
        ctx.strokeStyle = i === 1 ? "white" : i === 2 ? "#8b008b" : "#0000ff";
        ctx.strokeRect(pxLeft, pxTop, pxWidth, pxHeight);
      } else {
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
      }
    });

    // Export combined screenshot
    const dataUrl = combinedCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "combined-maps.png";
    link.click();
  };

  return {
    takeScreenshot,
    sendPrompt,
    Labels,
  };
};

export default useMapUtils;
