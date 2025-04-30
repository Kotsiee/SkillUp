import { Signal, useSignal } from '@preact/signals';
import { Files } from '../../lib/newtypes/index.ts';

export default function ImageViewer({
  file,
  controller,
}: {
  file: Files;
  controller: Signal<{ [ctrl: string]: Signal<any> } | null>;
}) {
  const clicked = useSignal<boolean>(false);
  const posX = useSignal<number>(0);
  const posY = useSignal<number>(0);

  const scale = useSignal<number>(0.75);
  const rotate = useSignal<number>(0);

  controller.value = {
    scale: scale,
    rotate: rotate,
  };

  return (
    <div class="image-viewer">
      <div
        class="image-viewer__content"
        onMouseDown={() => (clicked.value = true)}
        onMouseUp={() => (clicked.value = false)}
        onMouseLeave={() => (clicked.value = false)}
        onMouseMove={event => {
          if (clicked.value) {
            posX.value += event.movementX;
            posY.value += event.movementY;
          }
        }}
      >
        <div
          class="image-viewer__content-image"
          style={{
            scale: scale.value.toString(),
            rotate: `${rotate.value}deg`,
            translate: `${posX.value}px ${posY.value}px`,
          }}
        >
          <img
            class="image-viewer__content-background"
            src={file.publicURL}
            draggable={false}
            style={{
              filter: `blur(${(1 / scale.value) * 30}px)`,
            }}
          />
          <img class="image-viewer__content-foreground" src={file.publicURL} draggable={false} />
        </div>
      </div>
    </div>
  );
}
