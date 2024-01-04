"use client";

import { uploadToS3 } from "@/lib/s3";
import { Inbox, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log("acceptedFiles", acceptedFiles);
      const file = acceptedFiles[0];

      if (file.size > 10 * 1024 * 1024) {
        alert("please upload a smaller file");
        return;
      }

      try {
        const data = await uploadToS3(file);
        console.log("data", data);
      } catch (error) {
        console.log("error", error);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <>
            {/* loading state */}
            <Loader2 className="h-10 w-10 text-slate-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Spilling Tea to GPT...</p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-slate-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
