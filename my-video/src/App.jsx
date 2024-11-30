import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [videoFile, setVideoFile] = useState(null); // Store video file
  const [annotations, setAnnotations] = useState([]); // Store annotations
  const [currentAnnotation, setCurrentAnnotation] = useState(''); // Text for new annotation
  const [timestamp, setTimestamp] = useState(''); // Timestamp for new annotation
  const videoRef = useRef(null); // Ref to control the video element

  // Handle video file drop/upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video')) {
      setVideoFile(URL.createObjectURL(file)); // Set video file URL
    }
  };

  // Handle adding an annotation at a specific timestamp
  const addAnnotation = () => {
    if (timestamp && currentAnnotation) {
      const newAnnotation = { timestamp: parseFloat(timestamp), text: currentAnnotation };
      setAnnotations((prev) => [...prev, newAnnotation]);
      setCurrentAnnotation('');
      setTimestamp('');
    }
  };

  // Highlight annotations at the right timestamp
  const [currentAnnotationDisplay, setCurrentAnnotationDisplay] = useState(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = videoRef.current?.currentTime;
      const currentAnn = annotations.find(
        (ann) => Math.abs(currentTime - ann.timestamp) < 0.5
      );
      setCurrentAnnotationDisplay(currentAnn || null);
    }, 100);

    return () => clearInterval(interval);
  }, [annotations]);

  return (
    <div className="App">
      {/* Video Upload */}
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      
      {/* Video Player */}
      {videoFile && (
        <div>
          <video ref={videoRef} controls width="600">
            <source src={videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Add Annotation Form */}
      <div>
        <input
          type="text"
          placeholder="Enter annotation text"
          value={currentAnnotation}
          onChange={(e) => setCurrentAnnotation(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter timestamp (in seconds)"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
        />
        <button onClick={addAnnotation}>Add Annotation</button>
      </div>

      {currentAnnotationDisplay && (
        <div style={{ position: 'absolute', top: '10%', left: '10%', backgroundColor: 'white' }}>
          <h4>{currentAnnotationDisplay.text}</h4>
        </div>
      )}

      {/* List all Annotations */}
      <h3>Annotations:</h3>
      <ul>
        {annotations.map((annotation, index) => (
          <li key={index}>
            {`At ${annotation.timestamp}s: ${annotation.text}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
