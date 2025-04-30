import { useSignal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';

export default function ChatResize() {
  const isResizing = useSignal(false);

  const startResizing = (event: MouseEvent) => {
    isResizing.value = true;
    event.preventDefault();
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isResizing.value) {
      const root = document.documentElement;
      const winWidth = localStorage.getItem('navbarState') == 'open' ? 300 : 60;
      root.style.setProperty('--messages-width', `${Math.max(event.clientX - winWidth, 300)}px`);
    }
  };

  const stopResizing = () => {
    isResizing.value = false;
  };

  globalThis.addEventListener('mousemove', handleMouseMove);
  globalThis.addEventListener('mouseup', stopResizing);

  return <div class="chat-layout__resizer" onMouseDown={startResizing} />;
}
