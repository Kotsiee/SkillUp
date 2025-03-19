// deno-lint-ignore-file no-explicit-any
import { Signal, useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { editFile, Files } from "../../../lib/types/index.ts";
import { useEffect, useImperativeHandle, useRef } from "preact/hooks";
import CircleCrop from "./cropper.tsx";
import LabelSlider from "../../LabelSlider.tsx";
import AIcon, { Icons } from "../../Icons.tsx";

interface EditImageProps {
  selectedFile: Files;
  modificationHistory: Signal<editFile[]>;
  onSave?: (image?: string) => void;

  thisRef?: any;
}

export default function ImageEditor (props: EditImageProps) {
  const ref = useRef<any>(null);
  const { selectedFile, modificationHistory, onSave } = props;

  // Local signals for transformations
  const rotate = useSignal<number>(0);
  const scale = useSignal<number>(100);
  const flipX = useSignal<boolean>(false);
  const flipY = useSignal<boolean>(false);
  const lastPosX = useSignal<number>(0);
  const lastPosY = useSignal<number>(0);

  // On component mount (or whenever `selectedFile` changes),
  // load transformations from modificationHistory if they exist
  useEffect(() => {
    const existingEntry = modificationHistory.value.find((item) =>
      item.file.id === selectedFile.id
    );
    const t = existingEntry?.transformations?.image;

    rotate.value = t?.rotation ?? 0;
    scale.value = t?.scale ?? 100;
    flipX.value = t?.flipX ?? false;
    flipY.value = t?.flipY ?? false;
    lastPosX.value = t?.lastPosX ?? 0;
    lastPosY.value = t?.lastPosY ?? 0;
  }, [selectedFile]);

  // Whenever any transform changes, update the modificationHistory automatically
  useEffect(() => {
    // 1) Find or create the editFile entry
    const existingIndex = modificationHistory.value.findIndex(
      (item) => item.file.id === selectedFile.id,
    );

    let newHistory = [...modificationHistory.value];

    // If there's no record for this file, create one
    if (existingIndex === -1) {
      newHistory.push({
        file: selectedFile,
        transformations: { image: {} },
      });
    }

    // 2) Update transformations
    newHistory = newHistory.map((item) => {
      if (item.file.id !== selectedFile.id) return item;

      return {
        ...item,
        transformations: {
          ...item.transformations,
          image: {
            rotation: rotate.value,
            scale: scale.value,
            flipX: flipX.value,
            flipY: flipY.value,
            lastPosX: lastPosX.value,
            lastPosY: lastPosY.value,
          },
        },
      };
    });

    modificationHistory.value = newHistory;
  }, [
    rotate.value,
    scale.value,
    flipX.value,
    flipY.value,
    lastPosX.value,
    lastPosY.value,
  ]);

  // Example "Save Changes" handler
  const handleSave = async () => {
    const existingIndex = modificationHistory.value.findIndex(
      (item) => item.file.id === selectedFile.id,
    );

    if (existingIndex !== -1) {
      const image = await ref.current.generatePreview();

      const updated = modificationHistory.value.map((item) =>
        item.file.id === selectedFile.id
          ? {
            ...item,
            file: { ...item.file, publicURL: image, isUpload: true },
          }
          : item
      );

      modificationHistory.value = updated;

      if (onSave) onSave(image);
      return;
    }

    // Optional callback if parent wants to do more on save
    if (onSave) onSave();
  };

  useImperativeHandle(props.thisRef, () => ({
    handleSave,
  }));

  return (
    <div class="edit-image">
      <div class="edit-area">
        <div class="bed" />
        <CircleCrop
          size={300}
          img={selectedFile.isUpload
            ? selectedFile.publicURL
            : `http://localhost:8000/api/image/proxy?url=${selectedFile.publicURL}`}
          zoom={scale}
          rotate={rotate}
          flipX={flipX}
          flipY={flipY}
          xPos={lastPosX}
          yPos={lastPosY}
          thisRef={ref}
        />
        <div class="bed" />
      </div>

      <div class="controls">
        <div class="rotation">
          <p>Rotation</p>

          <div class="rotation-input-container">
            <div class="rotation-input">
              <LabelSlider value={rotate} min={-180} max={180}>
                <AIcon startPaths={Icons.Filter} size={16} />
              </LabelSlider>

              <input
                type="number"
                value={rotate.value}
                min={-180}
                max={180}
                step={1}
                onInput={(val) =>
                  rotate.value = Number.parseInt(val.currentTarget.value)}
              />
              <p>°</p>
            </div>
          </div>

          <div class="fixed-rotate">
            <button
              onClick={() => {
                if ((rotate.value - 90) <= -180) {
                  const remainer = 180 + (rotate.value - 90);
                  rotate.value = 180 - remainer;
                } else {
                  rotate.value -= 90;
                }
              }}
            >
              <AIcon startPaths={Icons.Filter} size={16} />
            </button>

            <button
              onClick={() => {
                if ((rotate.value + 90) >= 180) {
                  const remainer = 180 - (rotate.value + 90);
                  rotate.value = -180 + remainer;
                } else {
                  rotate.value += 90;
                }
              }}
            >
              <AIcon startPaths={Icons.Filter} size={16} />
            </button>

            <button onClick={() => flipX.value = !flipX.value}>
              <AIcon startPaths={Icons.Filter} size={16} />
            </button>

            <button
              onClick={() => flipY.value = !flipY.value}
            >
              <AIcon startPaths={Icons.Filter} size={16} />
            </button>
          </div>
        </div>

        <div class="scale">
          <p>Scale</p>

          <div class="scale-input-container">
            <div class="scale-input">
              <LabelSlider value={scale} min={50} max={200}>
                <AIcon startPaths={Icons.Filter} size={16} />
              </LabelSlider>

              <input
                type="number"
                value={scale.value}
                min={50}
                max={200}
                onInput={(val) =>
                  scale.value = Number.parseInt(val.currentTarget.value)}
              />
              <p>%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
