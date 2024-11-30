import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // Make sure Tailwind CSS or your custom CSS is linked

function App() {
  const [videoFile, setVideoFile] = useState(null);  // Holds the video file
  const [annotations, setAnnotations] = useState([]);  // Stores annotation objects (timestamps + content)
  const [annotationType, setAnnotationType] = useState('');  // Stores selected annotation type (question, feedback, etc.)
  const [currentAnnotation, setCurrentAnnotation] = useState('');  // Holds the current annotation's content
  const [videoTimestamp, setVideoTimestamp] = useState('');  // Timestamp for annotation
  const [modalOpen, setModalOpen] = useState(false);  // Controls visibility of the modal
  const [videoPaused, setVideoPaused] = useState(false);  // Controls whether the video is paused
  const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState('');  // For storing the answer for questions

  const videoRef = useRef(null);  // Reference to the video element for playback control

  // Handle video file upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(URL.createObjectURL(file));
    }
  };

  // Adding an annotation (question/feedback)
  const handleAddAnnotation = () => {
    const newAnnotation = {
      type: annotationType,  // question or feedback
      content: currentAnnotation,
      timestamp: parseInt(videoTimestamp, 10),  // Timestamp when this annotation should show
    };
    setAnnotations([...annotations, newAnnotation]);
    setCurrentAnnotation('');
    setVideoTimestamp('');
  };

  // Play or pause the video at specific timestamps based on annotations
  const handleVideoTimeUpdate = () => {
    const currentTime = videoRef.current.currentTime;
    // Check if there are any annotations at this timestamp
    annotations.forEach((annotation) => {
      if (currentTime >= annotation.timestamp && currentTime < annotation.timestamp + 1) {
        if (annotation.type === 'question') {
          setModalOpen(true);
          setVideoPaused(true);
        } else if (annotation.type === 'feedback') {
          // For feedback, show the feedback without pausing the video
          alert(`Feedback: ${annotation.content}`);
        }
      }
    });
  };

  const handleSubmitAnswer = () => {
    setModalOpen(false);
    setVideoPaused(false); // Unpause video
    videoRef.current.currentTime += 1;
    if (videoRef.current) videoRef.current.play();
  };

  // Handle the video pause/resume
  useEffect(() => {
    if (videoPaused && videoRef.current) {
      videoRef.current.pause();
    } else {
      if (videoRef.current) videoRef.current.play();
    }
  }, [videoPaused]);

  return (
    <div className="container mx-auto p-4">
      {/* Video Upload Section */}
      <div className="mb-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="border p-2"
        />
      </div>

      {/* Video Player */}
      {videoFile && (
        <div className="relative">
          <video
            ref={videoRef}
            src={videoFile}
            controls
            className="w-full h-auto"
            onTimeUpdate={handleVideoTimeUpdate}
          ></video>
          {/* Display Prompts Above Video */}
          {annotations.map((annotation, index) => {
            if (annotation.type === 'prompt') {
              return (
                <div
                  key={index}
                  className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded"
                  style={{
                    top: `${(annotation.timestamp / 60) * 100}%`, // Basic timestamp calculation for position
                  }}
                >
                  {annotation.content}
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {/* Annotation Controls */}
      <div className="mt-4">
        <select
          value={annotationType}
          onChange={(e) => setAnnotationType(e.target.value)}
          className="border p-2"
        >
          <option value="">Select Annotation Type</option>
          <option value="question">Question</option>
          <option value="feedback">Feedback</option>
          <option value="prompt">Prompt</option>
        </select>
        <input
          type="text"
          placeholder="Enter annotation content"
          value={currentAnnotation}
          onChange={(e) => setCurrentAnnotation(e.target.value)}
          className="border p-2 mx-2"
        />
        <input
          type="number"
          placeholder="Enter timestamp (seconds)"
          value={videoTimestamp}
          onChange={(e) => setVideoTimestamp(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={handleAddAnnotation}
          className="bg-blue-500 text-white p-2 ml-2"
        >
          Add Annotation
        </button>
      </div>
      <div className="w-full max-w-3xl mb-5">
        <h3 className="text-xl font-bold mb-2">Annotations:</h3>
        {annotations.map((annotation, index) => (
          <div key={index} className="mb-2">
            <p>
              <div key={index} className="p-2 bg-black bg-opacity-50 text-white rounded mb-2">
                <strong>{annotation.type === 'question' ? 'Question' : annotation.type === 'prompt' ? 'Prompt' : 'Feedback'}:</strong> {annotation.content}
                <strong> at </strong>{annotation.timestamp}s
              </div>
            </p>
          </div>
        ))}
      </div>

      {/* Modal for Question */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl mb-4">Please answer the question</h2>
            <p>{annotations.find((annotation) => annotation.type === 'question')?.content}</p>
            <input
              type="text"
              value={currentQuestionAnswer}
              onChange={(e) => setCurrentQuestionAnswer(e.target.value)}
              className="border p-2 w-full mt-2"
            />
            <button
              onClick={handleSubmitAnswer}
              className="bg-green-500 text-white p-2 mt-4"
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
