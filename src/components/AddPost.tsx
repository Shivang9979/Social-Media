"use client";

import { useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import AddPostButton from "./AddPostButton";
import { addPost } from "@/lib/actions";
import Video from "./feed/Video";
import { Result } from "postcss";

const AddPost = () => {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<any>();
  const [videourl, setVideo] = useState<any>();

  const handleSubmit = async (formData: FormData) => {
    await addPost(formData, img?.secure_url || "", videourl?.secure_url || "");
    setImg(null);
    setVideo(null);
    setDesc("");  // Optionally, clear the description as well
  };

  if (!isLoaded) {
    return "Loading...";
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={user?.imageUrl || "/noAvatar.png"}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.target as HTMLFormElement)); }} className="flex gap-4">
          <textarea
            placeholder="What's on your mind?"
            className="flex-1 bg-slate-100 rounded-lg p-2"
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          <div className="">
            <Image
              src="/emoji.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
            <AddPostButton />
          </div>
        </form>
        {/* POST OPTIONS */}
        
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <CldUploadWidget
            uploadPreset="social"
            onSuccess={(result, { widget }) => {
              setImg(result.info);
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image src="/addimage.png" alt="" width={20} height={20} />
                  Photo
                </div>
              );
            }}
          </CldUploadWidget>
          <CldUploadWidget
            uploadPreset="social"
            options={{ folder: "videos", resourceType: "video" }}
            onSuccess={(result, { widget }) => {
              setVideo(result.info);
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => open()}>
                  <Image src="/addVideo.png" alt="" width={20} height={20} />
                  Video
                </div>
              );
            }}
          </CldUploadWidget>

          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/poll.png" alt="" width={20} height={20} />
            Poll
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addevent.png" alt="" width={20} height={20} />
            Event
          </div>
        </div>
        <div>
          {/* <Video/> */}
        </div>
      </div>
    </div>
  );
};

export default AddPost;
