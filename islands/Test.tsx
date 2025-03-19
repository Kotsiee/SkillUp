import { useState } from 'preact/hooks';

export default function Test() {
  const [vals, setVals] = useState("")

  return (
    <div class="modal">
      <button
      onClick={async () => {
        await fetch('/api/test',
          {
            method: "POST"
          }
        )

        console.log("clicked POST")
      }}
      >POST</button>

      <button
      onClick={async () => {
        const cc = await fetch('/api/test',
          {
            method: "GET"
          }
        )

        console.log("clicked GET")
        console.log(await cc.json())
      }}
      >GET</button>
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