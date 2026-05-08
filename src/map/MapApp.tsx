import { DndContext, TouchSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { Entity, LabelGraphics } from "resium";
import { Cartesian2, Cartesian3, Color, VerticalOrigin, HeightReference } from "cesium";
import MainMap from "./MainMap";
import CameraControls from "./CameraControls";
import OverviewMap from "./OverviewMap";
import PipViewRectangle from "./PipViewRectangle";
import PipMap from "./PipMap";
import Layers from "./Layers";
import useMapState from "./useMapState";
import { CameraContext } from "./types";

// TODO: draw mode
// TODO: icons
// TODO: resize widgets
// TODO: compass
// TODO: mobile dnd
// TODO: right click context menu
// TODO: finish send to report utility
// TODO: finish ai command layer

const MapApp = () => {
  const mapState = useMapState();
  const {
    mainViewerRef,
    overviewViewerRef,
    pipViewerRef,
    pipViewer2Ref,
    handleDragStart,
    handleDragEnd,
    layer,
    showOverviewMap,
    showPipMap,
    showPipMap2,
    widgetState,
    containerRef,
  } = mapState;
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );
  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden cursor-pointer">
      <DndContext
        sensors={sensors}
        modifiers={[restrictToParentElement]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <CameraContext.Provider value={{ mainViewerRef, overviewViewerRef, pipViewerRef, pipViewer2Ref }}>
          <MainMap>
            <PipViewRectangle show={showPipMap} isPip2={false} />
            <PipViewRectangle show={showPipMap2} isPip2={true} />
            <Layers layer={layer} />
            <CameraControls />
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
          </MainMap>
          {showOverviewMap && (
            <OverviewMap overviewState={widgetState.overview}>
              <Layers layer={layer} />
            </OverviewMap>
          )}
          {showPipMap && (
            <PipMap pipState={widgetState.pip} isPip2={false}>
              <Layers layer={layer} />
            </PipMap>
          )}
          {showPipMap2 && (
            <PipMap pipState={widgetState.pip2} isPip2={true}>
              <Layers layer={layer} />
            </PipMap>
          )}
        </CameraContext.Provider>
      </DndContext>
    </div>
  );
};

export default MapApp;
