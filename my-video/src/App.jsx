import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [currentAnnotation, setCurrentAnnotation] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState('');
  const [annotationType, setAnnotationType] = useState('question');
  const [isPreviewing, setIsPreviewing] = useState(false);

  const videoRef = useRef(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    setVideoFile(URL.createObjectURL(file));
  };

  const addAnnotation = () => {
    if (currentTimestamp && currentAnnotation) {
      const newAnnotation = {
        timestamp: parseFloat(currentTimestamp),
        text: currentAnnotation,
        type: annotationType,
      };
      setAnnotations((prevAnnotations) => [...prevAnnotations, newAnnotation]);
      setCurrentTimestamp('');
      setCurrentAnnotation('');
    }
  };

  useEffect(() => {
    if (videoRef.current && annotations.length > 0) {
      const interval = setInterval(() => {
        const currentTime = videoRef.current.currentTime;
        const currentAnnotation = annotations.find(
          (annotation) => Math.abs(annotation.timestamp - currentTime) < 0.5
        );

        if (currentAnnotation) {
          alert(`${currentAnnotation.type.toUpperCase()}: ${currentAnnotation.text}`);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [annotations]);

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <div className="flex flex-col items-center mb-6">
        <label className="text-xl font-semibold mb-2">Upload Video</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
      </div>

      {videoFile && (
        <div className="flex flex-col items-center mb-6">
          <video
            ref={videoRef}
            src={videoFile}
            controls
            className="w-full max-w-xl rounded shadow-lg"
          />
        </div>
      )}

    
      <div className="mb-6">
        <label className="text-lg font-semibold">Add Annotation</label>
        <div className="flex flex-col space-y-4 mt-4">
       
          <div>
            <label className="text-sm">Timestamp (seconds):</label>
            <input
              type="number"
              step="0.1"
              value={currentTimestamp}
              onChange={(e) => setCurrentTimestamp(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter time in seconds"
            />
          </div>

          <div>
            <label className="text-sm">Annotation Type:</label>
            <select
              value={annotationType}
              onChange={(e) => setAnnotationType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            >
              <option value="question">Question</option>
              <option value="feedback">Feedback</option>
              <option value="prompt">Prompt</option>
            </select>
          </div>

          <div>
            <label className="text-sm">Annotation Text:</label>
            <textarea
              value={currentAnnotation}
              onChange={(e) => setCurrentAnnotation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter annotation text"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={addAnnotation}
              className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600"
            >
              Add Annotation
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsPreviewing(!isPreviewing)}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          {isPreviewing ? 'Stop Preview' : 'Preview Video with Annotations'}
        </button>
      </div>

      {isPreviewing && (
        <div className="mt-6 p-4 border border-gray-300 rounded shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Annotations:</h3>
          <ul>
            {annotations.map((annotation, index) => (
              <li key={index} className="mb-2">
                <strong>{annotation.type.charAt(0).toUpperCase() + annotation.type.slice(1)}:</strong>
                <p>{annotation.text} <span className="text-gray-500">at {annotation.timestamp} seconds</span></p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
