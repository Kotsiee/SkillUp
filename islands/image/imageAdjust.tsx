import { useEffect, useImperativeHandle, useRef } from "preact/hooks";
import {
  effect,
  Signal,
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import * as fabric from "https://esm.sh/fabric@6.6.1";
import { JSX } from "preact/jsx-runtime";

interface IImageAdjust {
  size: number;
  img?: string | null;

  zoom?: Signal<number>;
  rotate?: Signal<number>;
  xPos?: Signal<number>;
  yPos?: Signal<number>;
  flipX?: Signal<boolean>;
  flipY?: Signal<boolean>;

  thisRef?: any;
}

export default function CircleCrop(
  { size, img, zoom, className, rotate, thisRef, flipX, flipY, xPos, yPos }:
    & IImageAdjust
    & JSX.HTMLAttributes<HTMLCanvasElement>,
) {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const fabricImg = useRef<fabric.Image | null>(null);
  const fabricCutout = useRef<fabric.Circle | null>(null);

  const isDragging = useRef(false);
  const lastPosX = useSignal<number>(0);
  const lastPosY = useSignal<number>(0);

  const scaleFactor = size / 1080;

  const calcZoom = () => {
    return zoom!.value * (1080 / 100);
  }

  useEffect(() => {
    if (!canvasEl.current) return;

    if (!fabricCanvas.current) {
      fabricCanvas.current = new fabric.Canvas(canvasEl.current, {
        selection: false,
      });
      fabricCanvas.current.width = 1080;
      fabricCanvas.current.height = 1080;

      canvasEl.current.width = 1080;
      canvasEl.current.height = 1080;
    }
  });

  useEffect(() => {
    const canvas = fabricCanvas.current;

    if (!canvas) return;

    fabric.FabricImage.fromURL(img ? img : "").then((img) => {
      img.scaleToWidth(calcZoom() || 1080);
      img.scaleToHeight(calcZoom() || 1080);
      img.rotate(rotate?.value || 0);
      img.set({
        left: xPos?.value || canvas.width! / 2,
        top: yPos?.value || canvas.height! / 2,
        selectable: false,
        evented: false,
        originX: "center",
        originY: "center",
        flipX: flipX?.value,
        flipY: flipY?.value,
      });

      fabricImg.current = img;
      canvas.add(img);

      const overlay = new fabric.Rect({
        width: canvas.width!,
        height: canvas.height!,
        fill: "rgba(0, 0, 0, 0.7)",
        selectable: false,
        evented: false,
      });

      const cutout = new fabric.Circle({
        radius: canvas.height / 2,
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
      });

      fabricCutout.current = cutout;

      const overlayCanvas = new fabric.Canvas("", {
        height: canvas.height,
        width: canvas.width,
      });
      overlayCanvas.add(overlay);

      cutout.globalCompositeOperation = "destination-out";
      overlayCanvas.add(cutout);
      overlayCanvas.renderAll();

      const overlayImage = new fabric.FabricImage(
        overlayCanvas.toCanvasElement(),
        {
          selectable: false,
          evented: false,
        },
      );

      canvas.add(overlayImage);
    });

    canvas.renderAll();

    canvas.on("mouse:down", (event) => {
      isDragging.current = true;

      // @ts-ignore: Suppresses the next line's TypeScript error
      lastPosX.value = event.e.clientX / scaleFactor;
      // @ts-ignore: Suppresses the next line's TypeScript error
      lastPosY.value = event.e.clientY / scaleFactor;
    });

    canvas.on("mouse:move", (event) => {
      if (!isDragging.current || !fabricImg.current) return;

      const img = fabricImg.current;

      // @ts-ignore: Suppresses the next line's TypeScript error
      const deltaX = event.e.clientX / scaleFactor - lastPosX.value;
      // @ts-ignore: Suppresses the next line's TypeScript error
      const deltaY = event.e.clientY / scaleFactor - lastPosY.value;

      img.set({
        left: img.left! + deltaX,
        top: img.top! + deltaY,
      });

      // @ts-ignore: Suppresses the next line's TypeScript error
      lastPosX.value = event.e.clientX / scaleFactor;
      // @ts-ignore: Suppresses the next line's TypeScript error
      lastPosY.value = event.e.clientY / scaleFactor;

      xPos!.value = fabricImg.current?.left!
      yPos!.value = fabricImg.current?.top!

      canvas.renderAll();
    });

    canvas.on("mouse:up", () => {
      isDragging.current = false;

      xPos!.value = fabricImg.current?.left!
      yPos!.value = fabricImg.current?.top!
    });

    return () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.dispose();
        fabricCanvas.current = null;
        fabricImg.current = null;

        if (canvasEl.current) {
          canvasEl.current.width = size;
          canvasEl.current.height = size;
        }
      }
    };
  }, [img]);

  effect(() => {
    if (fabricImg.current && fabricCanvas.current) {
      fabricImg.current.scaleToHeight(calcZoom() || 1080);
      fabricImg.current.rotate(rotate?.value || 0);
      fabricImg.current.set({
        left: fabricImg.current.left,
        top: fabricImg.current.top,
        flipX: flipX?.value,
        flipY: flipY?.value,
      });

      fabricCanvas.current.renderAll();
    }
  });

  useImperativeHandle(thisRef, () => ({
    generatePreview,
  }));

  const generatePreview = async () => {
    if (!fabricCanvas.current) return;
    const canvas = fabricCanvas.current;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width!;
    tempCanvas.height = canvas.height!;

    const previewCanvas = new fabric.Canvas(tempCanvas);
    previewCanvas.backgroundColor = "transparent";

    // ✅ Wait for image cloning
    const img = await fabricImg.current!.clone();

    previewCanvas.add(img);
    previewCanvas.renderAll();

    return tempCanvas.toDataURL();
  };

  return <canvas class={className} height={size} width={size} ref={canvasEl} />;
}
