"use client";

import { useState, useRef } from "react";
import { FaPlay } from "react-icons/fa";

interface VideoPlayerProps {
  video: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto rounded-lg ">
      <video
        ref={videoRef}
        className={`w-full h-auto rounded-lg`}
        src={video}
        onClick={handlePlayPause}
      />
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-opacity-50 text-white bg-black rounded-lg "
          onClick={handlePlayPause}
        >
          <FaPlay
            size={80}
            className="transition-all duration-5000 ease-in delay-5000"
           
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
