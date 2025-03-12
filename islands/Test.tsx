import { useUser } from "./contexts/UserProvider.tsx";

export default function Test() {
  const { user } = useUser()

  return (
    <div class="modal">
      <button>Lickle Test yk</button>
    </div>
  );
}

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