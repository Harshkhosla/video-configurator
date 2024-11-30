import React, { useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ videoUrl, onVideoPause, injectedData }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const handlePause = (time) => {
    setCurrentTime(time);
    onVideoPause(time); // Notify parent component to inject data at this time
  };

  return (
    <div>
      <ReactPlayer
        url={videoUrl}
        playing={playing}
        onPause={() => handlePause(currentTime)}
        onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
        controls
      />
      <button onClick={() => setPlaying(!playing)}>{playing ? "Pause" : "Play"}</button>

      {/* Show injected data */}
      {injectedData && injectedData[currentTime] && (
        <div>
          <h3>{injectedData[currentTime].title}</h3>
          <p>{injectedData[currentTime].content}</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
