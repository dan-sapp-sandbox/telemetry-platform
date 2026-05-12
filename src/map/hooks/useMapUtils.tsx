import { type JSX } from "react";
import { Cartesian3, Cartesian2, Color, VerticalOrigin, HeightReference } from "cesium";
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

export interface IMapState {
  sendPrompt: () => Promise<void>;
  Labels: JSX.Element;
}

const useMapUtils = (): IMapState => {
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

  return {
    sendPrompt,
    Labels,
  };
};

export default useMapUtils;
