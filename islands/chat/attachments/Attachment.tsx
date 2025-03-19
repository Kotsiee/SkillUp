// deno-lint-ignore-file no-explicit-any
import { PageProps } from "$fresh/server.ts";
import { useEffect, useState } from "preact/hooks";
import { FileReference, Files } from "../../../lib/types/index.ts";
import {
  Signal,
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { VNode } from "preact/src/index.d.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import LabelSlider from "../../../components/LabelSlider.tsx";
import AIcon, { Icons } from "../../../components/Icons.tsx";

export default function Attachment({ pageProps }: { pageProps: PageProps }) {
  const [file, setFile] = useState<FileReference | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(
          `/api/storage/${pageProps.params.attId}`,
        );
        if (!response.ok) throw new Error("Failed to fetch chat data");
        const { json } = await response.json();
        setFile(json);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    fetchFile();
  }, [pageProps.params.chatid]);

  if (!file) return null;

  const controller = useSignal<{ [ctrl: string]: Signal<any> } | null>(null);

  const switchView = (file: Files): [VNode<any> | null, VNode<any> | null] => {
    if (!file.verified) return [null, null];

    switch (file.fileType!.toLowerCase()) {
      case "image":
        return [
          <ImageViewer file={file} controller={controller} />,
          <ImageController controller={controller} />,
        ];
      case "video":
        return [
          <VideoViewer file={file} controller={controller} />,
          <ImageController controller={controller} />,
        ];
      case "audio":
        return [
          <AudioViewer file={file} controller={controller} />,
          <ImageController controller={controller} />,
        ];
      case "text":
        return [
          <TextViewer file={file} controller={controller} />,
          <ImageController controller={controller} />,
        ];
      default:
        return [null, null];
    }
  };

  const switchTab = (currentTab: string) => {
    switch (currentTab) {
      case "Overview":
        return <OverviewTab />;
      case "Controls":
        return <ControlsTab controller={controllerType}/>;
      case "Comments":
        return <CommentsTab />;
      case "Review":
        return <ReviewTab />;
      default:
        return <div>Null</div>;
    }
  };

  const viewController = switchView(file.file!);

  const viewerType = useSignal<any>(viewController?.[0]);
  const controllerType = useSignal<any>(viewController?.[1]);

  const currentTab = useSignal<string>("Overview");
  const tabs = ["Overview", "Controls", "Comments", "Review"];

  const createdAtDate = DateTime.fromISO(file.createdAt as any);

  return (
    <div class="attachment-viewer">
      <div class="file-actions">
        <a>Back</a>

        <div>
          <button>Download</button>
          <button>Copy Link</button>
          <button>Share</button>
          <div>
            <button>...</button>
            <div>
              <button>Report</button>
              <button>Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div class="file-viewer">
        {viewerType.value}
      </div>

      <div class="file-details">
        <div class="obj-info">
          <h5 class="title">{file.meta?.publicName}</h5>
          <p class="obj-type">{file.file?.fileType || file.file?.mimeType}</p>
          <p class="sent-at">{createdAtDate.toFormat("DDDD' - 'HH':'mm")}</p>
        </div>

        <div class="tabs">
          <div class="tabs-nav">
            {tabs.map((tab, index) => (
              <label key={`${tab}-${index}`}>
                <input
                  type="radio"
                  name="file-details-tab-nav"
                  onInput={() => {
                    currentTab.value = tab;
                  }}
                  checked={currentTab.value === tab}
                  hidden
                />
                {tab}
              </label>
            ))}
          </div>

          <div class="file-tab">
            {switchTab(currentTab.value)}
          </div>
        </div>
      </div>
    </div>
  );
}


// Message, Sender, 
function OverviewTab() {
  return (
    <div>
    </div>
  );
}

function ControlsTab({controller} : {controller: Signal<{ [ctrl: string]: Signal<any> } | null>}) {
  return (
    <div>
      {controller.value}
    </div>
  );
}

function ReviewTab() {
  return (
    <div>
    </div>
  );
}

function CommentsTab() {
  return (
    <div>
    </div>
  );
}

interface IViewer {
  file: Files;
  controller: Signal<{ [ctrl: string]: Signal<any> } | null>;
}

function ImageViewer({ file, controller }: IViewer) {
  const clicked = useSignal<boolean>(false);
  const posX = useSignal<number>(0);
  const posY = useSignal<number>(0);

  const scale = useSignal<number>(0.75);
  const rotate = useSignal<number>(0);

  controller.value = {
    "scale": scale,
    "rotate": rotate,
  };

  return (
    <div class="image-viewer">
      <div class="image-content"

      onMouseDown={() => clicked.value = true}
      onMouseUp={() => clicked.value = false}
      onMouseLeave={() => clicked.value = false}

      onMouseMove={(event) => {
        if (clicked.value) {
          posX.value += event.movementX
          posY.value += event.movementY
        }
      }}
      
      >
        <div
          class="image"
          style={{
            scale: scale.value.toString(),
            rotate: `${rotate.value}deg`,
            translate: `${posX.value}px ${posY.value}px`
          }}
        >
          <img
            class="background"
            src={file.publicURL}
            draggable={false}
            style={{
              filter: `blur(${1 / scale.value * 30}px)`,
            }}
          />
          <img 
          class="forground" 
          src={file.publicURL}
          draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

function ImageController(
  { controller }: {
    controller: Signal<{ [ctrl: string]: Signal<any> } | null>;
  },
) {

  const rotate = controller.value?.["rotate"]!
  const scale = controller.value?.["scale"]!

  return (
      <div class="controls">
        <div class="rotation">
          <p>Rotation</p>

          <button onClick={() => rotate.value = 0}>Reset</button>
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
          </div>
        </div>

        <div class="scale">
          <p>Scale</p>

          <button onClick={() => scale.value = 0.75}>Reset</button>
          <div class="scale-input-container">
            <div class="scale-input">
              <LabelSlider value={scale} min={0.1} max={10} steps={0.01}>
                <AIcon startPaths={Icons.Filter} size={16} />
              </LabelSlider>

              <input
                type="number"
                value={scale.value}
                min={0.1}
                max={10}
                step={0.01}
                onInput={(val) =>
                  scale.value = Number.parseInt(val.currentTarget.value).toFixed(2)}
              />
              <p>x</p>
            </div>
          </div>
        </div>
      </div>
  );
}

function VideoViewer({ file, controller }: IViewer) {
  return (
    <div class="image-viewer">
      <h1>CBA</h1>
    </div>
  );
}

function AudioViewer({ file, controller }: IViewer) {
  return (
    <div class="image-viewer">
      <h1>CBA</h1>
    </div>
  );
}

function TextViewer({ file, controller }: IViewer) {
  return (
    <div class="image-viewer">
      <h1>CBA</h1>
    </div>
  );
}
