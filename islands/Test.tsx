import CircleCrop from "./image/imageAdjust.tsx";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";

export default function Test() {
  const imageUrl = useSignal<string | null>(null); // ✅ Store selected image

  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return;
      imageUrl.value = e.target.result as string; // ✅ Update image signal
    };

    reader.readAsDataURL(file);
    
    // const formData = new FormData();
    // formData.append("file", file);

    // // ✅ Send the image to the API
    // const response = await fetch("/api/image/resize", {
    //   method: "POST",
    //   body: formData,
    // });

    // if (response.ok) {
    //   const blob = await response.blob();
    //   setPreviewUrl(URL.createObjectURL(blob));
    // } else {
    //   console.error("Upload failed");
    // }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      <CircleCrop size={200} img={imageUrl.value}/>
      {/* {previewUrl && (
        <div>
          <h3>Resized Image Preview:</h3>
          <img src={previewUrl} alt="Resized Preview"/>
        </div>
      )} */}
    </div>
  );
}