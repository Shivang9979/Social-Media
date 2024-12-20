"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { addVideo } from "@/lib/actions";

const VideoUpload = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const handleUploadSuccess = (result: any) => {
    // Video URL
    const videoUrl = result.info.secure_url;
    setVideoUrl(videoUrl);

    // Generate and set the thumbnail URL
    const thumbnailUrl = result.info.thumbnail_url; // Cloudinary automatically generates a thumbnail
    setThumbnailUrl(thumbnailUrl);
    addVideo(thumbnailUrl,videoUrl)
  };

  return (
    <div className="flex flex-col items-center">
      <CldUploadWidget
        uploadPreset="social" // Replace with your Cloudinary upload preset
        options={{
          folder: "videos", // Specify the folder where videos will be uploaded
          resourceType: "video", // Set resource type to video
        }}
        onSuccess={(result) => handleUploadSuccess(result)}
      >
        {({ open }) => {
          return (
            <button
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={() => open()}
            >
              Upload Video
            </button>
          );
        }}
      </CldUploadWidget>

      {videoUrl && (
        <div className="mt-4">
          <h3>Video Uploaded Successfully</h3>
          <video src={videoUrl} controls className="w-full h-auto mt-2" />
        </div>
      )}

      {thumbnailUrl && (
        <div className="mt-4">
          <h3>Thumbnail</h3>
          <Image src={thumbnailUrl} alt="Thumbnail" width={300} height={200} />
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
