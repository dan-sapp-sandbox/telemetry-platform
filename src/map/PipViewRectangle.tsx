import React, { useContext, useMemo, useEffect, useCallback } from "react";
import { Entity } from "resium";
import { CameraContext } from "./types";
import { Cartographic, Cartesian2, Cartesian3, CallbackProperty, Color, Math, PolygonHierarchy } from "cesium";
import useLocalStorage from "use-local-storage";

const PipViewRectangle = ({ show, isPip2 }: { show: boolean; isPip2: boolean }) => {
  const { mainViewerRef, pipViewerRef, pipViewer2Ref } = useContext(CameraContext);
  const pipRef = isPip2 ? pipViewer2Ref : pipViewerRef;
  const pipId = isPip2 ? "pip-2-cam-init" : "pip-cam-init";

  const [_init, setInitCameraView] = useLocalStorage(pipId, {
    lat: 42,
    lon: 0,
    height: 100_000,
    heading: 0,
    pitch: -Math.PI / 2,
    roll: 0,
  });

  useEffect(() => {
    const pipViewer = pipRef.current;
    if (!pipViewer || !pipViewer.scene || !pipViewer.camera) return;

    let frame = 0;

    const update = () => {
      if (frame++ % 10 !== 0) return;

      const camera = pipViewer.camera;
      const carto = Cartographic.fromCartesian(camera.position);

      setInitCameraView({
        lon: Math.toDegrees(carto.longitude),
        lat: Math.toDegrees(carto.latitude),
        height: carto.height,
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll,
      });
    };

    pipViewer.camera.changed.addEventListener(update);

    return () => {
      pipViewer.camera.changed.removeEventListener(update);
    };
  }, [pipRef, setInitCameraView]);

  const frustum = useMemo(
    () =>
      new CallbackProperty(() => {
        try {
          const pipViewer = pipRef.current;
          if (!pipViewer) return undefined;

          const scene = pipViewer.scene;
          const camera = pipViewer.camera;
          const canvas = scene.canvas;

          const corners = [
            new Cartesian2(0, 0),
            new Cartesian2(canvas.clientWidth, 0),
            new Cartesian2(canvas.clientWidth, canvas.clientHeight),
            new Cartesian2(0, canvas.clientHeight),
          ];

          const positions: Cartesian3[] = [];

          for (const pixel of corners) {
            const ray = camera.getPickRay(pixel);
            if (!ray) return undefined;

            const hit = scene.globe.pick(ray, scene);
            if (!hit) return undefined;

            positions.push(hit);
          }

          return new PolygonHierarchy(positions);
        } catch (e) {
          console.log("e", e);
        }
      }, false),
    [pipRef],
  );

  const createDiagonal = useCallback(
    (rectCornerIndexA: number[], rectCornerIndexB: number[]) =>
      new CallbackProperty(() => {
        try {
          const mainViewer = mainViewerRef.current;
          const pipViewer = pipRef.current;
          if (!mainViewer || !pipViewer) return [];

          const { scene, camera, container } = mainViewer;

          const pipScene = pipViewer.scene;
          const pipCamera = pipScene.camera;
          const pipCanvas = pipScene.canvas;

          const cornerPixels = [
            new Cartesian2(0, 0),
            new Cartesian2(pipCanvas.clientWidth, 0),
            new Cartesian2(0, pipCanvas.clientHeight),
            new Cartesian2(pipCanvas.clientWidth, pipCanvas.clientHeight),
          ];

          const rectWorldCorners: Cartesian3[] = [];

          for (const pixel of cornerPixels) {
            const ray = pipCamera.getPickRay(pixel);
            if (!ray) continue;

            const intersection = pipScene.globe.pick(ray, pipScene);
            if (!intersection) return [];

            rectWorldCorners.push(intersection);
          }

          const rect = pipViewer.camera.computeViewRectangle();
          if (!rect) return [];

          const rectCorners = rectWorldCorners
            .map((world) => {
              const screen = mainViewer.scene.cartesianToCanvasCoordinates(world);
              if (!screen) return undefined;

              const ray = camera.getPickRay(screen);
              return ray ? scene.globe.pick(ray, scene) : undefined;
            })
            .filter((c): c is Cartesian3 => c !== undefined);

          if (rectCorners.length !== rectWorldCorners.length) return [];

          const pipBounds = pipViewer.container.getBoundingClientRect();
          const mainBounds = container.getBoundingClientRect();

          const toCanvas = (x: number, y: number) => new Cartesian2(x - mainBounds.left, y - mainBounds.top);

          const pickGlobe = (pos: Cartesian2) => {
            const ray = camera.getPickRay(pos);
            return ray ? scene.globe.pick(ray, scene) : undefined;
          };

          const pipCorners = [
            toCanvas(pipBounds.left, pipBounds.top),
            toCanvas(pipBounds.right, pipBounds.top),
            toCanvas(pipBounds.left, pipBounds.bottom),
            toCanvas(pipBounds.right, pipBounds.bottom),
          ]
            .map((pos) => pickGlobe(pos))
            .filter((c): c is Cartesian3 => c !== undefined);

          if (pipCorners.length !== 4) return [];

          const rectCartos = rectCorners.map((c) => Cartographic.fromCartesian(c));
          const pipCartos = pipCorners.map((c) => Cartographic.fromCartesian(c));

          const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

          const rectCenterLon = avg(rectCartos.map((c) => c.longitude));
          const rectCenterLat = avg(rectCartos.map((c) => c.latitude));

          const pipCenterLon = avg(pipCartos.map((c) => c.longitude));
          const pipCenterLat = avg(pipCartos.map((c) => c.latitude));

          const isEvenQuadrant =
            (rectCenterLon > pipCenterLon && rectCenterLat > pipCenterLat) ||
            (rectCenterLon < pipCenterLon && rectCenterLat < pipCenterLat);

          const [rectIndex, pipIndex] = isEvenQuadrant ? rectCornerIndexB : rectCornerIndexA;

          return [rectCorners[rectIndex], pipCorners[pipIndex]];
        } catch (e) {
          console.log("e", e);
        }
      }, false),
    [mainViewerRef, pipRef],
  );

  const diagonal1 = useMemo(() => createDiagonal([1, 1], [0, 0]), [createDiagonal]);

  const diagonal2 = useMemo(() => createDiagonal([2, 2], [3, 3]), [createDiagonal]);

  if (!show) return null;

  return (
    <>
      <Entity
        polygon={{
          hierarchy: frustum,
          material: isPip2 ? Color.BLUE.withAlpha(0.2) : Color.DARKMAGENTA.withAlpha(0.2),
          outline: true,
          outlineColor: isPip2 ? Color.BLUE : Color.DARKMAGENTA,
          outlineWidth: 1,
        }}
      />
      <Entity
        polyline={{
          positions: diagonal1,
          width: 1,
          material: isPip2 ? Color.BLUE : Color.DARKMAGENTA,
          arcType: 0,
        }}
      />
      <Entity
        polyline={{
          positions: diagonal2,
          width: 1,
          material: isPip2 ? Color.BLUE : Color.DARKMAGENTA,
          arcType: 0,
        }}
      />
    </>
  );
};

export default React.memo(PipViewRectangle);
