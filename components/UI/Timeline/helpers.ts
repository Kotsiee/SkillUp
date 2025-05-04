/** components/Timeline/useZoomPan.ts */
import { useSignal } from '@preact/signals';

export function useZoomPan(containerRef: { current: HTMLElement | null }) {
  // horizontal offset
  const offsetX = useSignal(0);
  // scale factor (1 = 100%)
  const scale = useSignal(1);

  // dragging state
  let dragging = false;
  let lastX = 0;

  // start drag
  const onMouseDown = (e: MouseEvent) => {
    dragging = true;
    lastX = e.clientX;
  };

  // during drag, adjust offsetX
  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    offsetX.value += dx;
    lastX = e.clientX;
  };

  // end drag
  const onMouseUp = () => {
    dragging = false;
  };

  // wheel to zoom
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    // zoom in/out faster or slower by tuning multiplier
    const delta = -e.deltaY * 0.002;
    scale.value = Math.max(0.5, Math.min(5, scale.value + delta));
  };

  // attach listeners once containerRef is set
  const attach = () => {
    const el = containerRef.current;
    if (!el) return;
    el.onmousedown = onMouseDown;
    el.onmousemove = onMouseMove;
    el.onmouseup = onMouseUp;
    el.onmouseleave = onMouseUp;
    el.onwheel = onWheel;
    // improve performance
    el.style.willChange = 'transform';
  };

  return { offsetX, scale, attach };
}
