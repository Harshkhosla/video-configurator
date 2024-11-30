import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // Tailwind CSS or custom styles

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [annotationType, setAnnotationType] = useState('');
  const [currentAnnotation, setCurrentAnnotation] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const videoRef = useRef(null);

  // Handle video file input
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(URL.createObjectURL(file));
    }
  };

  // Handle adding annotations (prompt or question)
  const handleAddAnnotation = () => {
    const newAnnotation = {
      type: annotationType,
      text: currentAnnotation,
      timestamp: parseFloat(timestamp),
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
    setCurrentAnnotation('');
    setTimestamp('');
  };

  // Handle video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      annotations.forEach((annotation) => {
        if (currentTime >= annotation.timestamp && !annotation.shown) {
          if (annotation.type === 'question') {
            // Pause video for questions and show modal
            setIsPaused(true);
            setShowQuestionModal(true);
          }
          // Mark prompt as shown
          annotation.shown = true;
        }
      });
    }
  };

  // Handle question submission
  const handleQuestionSubmit = () => {
    setShowQuestionModal(false);
    setIsPaused(false);
    setUserAnswer('');
    videoRef.current.play();
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [annotations]);

  return (
    <div className="flex flex-col items-center p-5">
      {/* Video Upload */}
      <div className="mb-5">
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Video Player */}
      {videoFile && (
        <div className="mb-5">
          <video
            ref={videoRef}
            src={videoFile}
            controls
            className="w-full max-w-3xl"
            paused={isPaused}
            onPlay={() => setIsPaused(false)}
          />
        </div>
      )}

      {/* Annotation Form */}
      <div className="mb-5">
        <select
          value={annotationType}
          onChange={(e) => setAnnotationType(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-3"
        >
          <option value="">Select Annotation Type</option>
          <option value="prompt">Prompt</option>
          <option value="question">Question</option>
        </select>
        <input
          type="text"
          value={currentAnnotation}
          onChange={(e) => setCurrentAnnotation(e.target.value)}
          placeholder="Enter Annotation"
          className="p-2 border border-gray-300 rounded mr-3"
        />
        <input
          type="number"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          placeholder="Timestamp in seconds"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleAddAnnotation}
          className="p-2 bg-blue-500 text-white rounded ml-3"
        >
          Add Annotation
        </button>
      </div>

      {/* Annotation Preview List */}
      <div className="w-full max-w-3xl mb-5">
        <h3 className="text-xl font-bold mb-2">Annotations:</h3>
        {annotations.map((annotation, index) => (
          <div key={index} className="mb-2">
            <p>
              <strong>{annotation.type === 'question' ? 'Question' : 'Prompt'}:</strong> {annotation.text} <strong>at</strong> {annotation.timestamp}s
            </p>
          </div>
        ))}
      </div>

      {/* Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Question:</h2>
            <p className="mb-4">What is your answer to the question?</p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="p-2 border border-gray-300 rounded mb-4 w-full"
              placeholder="Your answer..."
            />
            <button
              onClick={handleQuestionSubmit}
              className="p-2 bg-green-500 text-white rounded w-full"
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
