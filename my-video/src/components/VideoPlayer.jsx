import React from 'react';

const VideoPlayer = ({ videoFile, videoRef, handleVideoTimeUpdate }) => {
  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={videoFile}
        controls
        className="w-full h-auto"
        onTimeUpdate={handleVideoTimeUpdate}
      ></video>
    </div>
  );
};

export default VideoPlayer;
