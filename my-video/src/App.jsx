import React, { useState, useRef, useEffect } from 'react';
import axios from "axios"
import toast from 'react-hot-toast';
import useVideoUpload from "./hooks/useVideoUpload";

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoFilebolb, setVideoFilebolb] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [annotationType, setAnnotationType] = useState('');
  const [currentAnnotation, setCurrentAnnotation] = useState('');
  const [videoTimestamp, setVideoTimestamp] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState('');

  const { uploadVideo, isUploading, uploadProgress } = useVideoUpload();

  const videoRef = useRef(null);
  const handleDragOver = (event) => {
    event.preventDefault();
    if (!dragging) setDragging(true);
  };




  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(URL.createObjectURL(file));
      setVideoFilebolb(file)
      console.log(videoFile);

    } else {
      alert('Please drop a valid video file.');
    }
    setDragging(false);
  };





  const handleAddAnnotation = () => {
    const newAnnotation = {
      type: annotationType,
      content: currentAnnotation,
      timestamp: parseInt(videoTimestamp, 10),
    };
    setAnnotations([...annotations, newAnnotation]);
    setCurrentAnnotation('');
    setVideoTimestamp('');
  };




  const handleVideoTimeUpdate = () => {
    const currentTime = videoRef.current.currentTime;
    annotations.forEach((annotation) => {
      if (currentTime >= annotation.timestamp && currentTime < annotation.timestamp + 1) {
        if (annotation.type === 'question') {
          setModalOpen(true);
          setVideoPaused(true);
        } else if (annotation.type === 'feedback') {
          alert(`Feedback: ${annotation.content}`);
        }
      }
    });
  };



  const handleVideoUpload = async () => {
    if (!videoFilebolb) {
      toast.error('Please select a video file.');
      return;
    }
    
    if (annotations.length === 0) {
      toast.error('Please add annotations.');
      return;
    }
    await uploadVideo(videoFilebolb, annotations);
  };


 
  const handleSubmitAnswer = () => {
    setModalOpen(false);
    setVideoPaused(false);
    videoRef.current.currentTime += 1;
    if (videoRef.current) videoRef.current.play();
  };

  useEffect(() => {
    if (videoPaused && videoRef.current) {
      videoRef.current.pause();
    } else {
      if (videoRef.current) videoRef.current.play();
    }
  }, [videoPaused]);

  return (
    <div className="flex flex-col items-center p-5">
      <div className="mb-4">
     
        <div
          className="video-upload-area"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ border: '2px dashed #ccc', padding: '60px', textAlign: 'center', marginBottom: '20px' }}
        >
          <p>Drag & Drop a video file here</p>
        </div>
      </div>

      {videoFile && (
        <div className="relative flex justify-center">
          <video
            ref={videoRef}
            src={videoFile}
            controls
            className="w-1/2 h-1/2"
            onTimeUpdate={handleVideoTimeUpdate}
          ></video>
          {annotations.map((annotation, index) => {
            if (annotation.type === 'prompt') {
              return (
                <div
                  key={index}
                  className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded"
                  style={{
                    top: `${(annotation.timestamp / 60) * 100}%`, 
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

    
<form >
      <div className="mt-4">
        <select
          value={annotationType}
          onChange={(e) => setAnnotationType(e.target.value)}
          // className="border p-2"
           className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
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
          // className="border p-2 mx-2"
           className="border mx-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <input
          type="number"
          placeholder="Enter timestamp (seconds)"
          value={videoTimestamp}
          onChange={(e) => setVideoTimestamp(e.target.value)}
          // className="border p-2"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <button
          type='submit'
          onClick={handleAddAnnotation}
          // className="bg-blue-500 text-white p-2 ml-2"
          // className={`p-2 ml-2 rounded-lg ${
          //   annotationType && currentAnnotation && videoTimestamp
          //     ? "bg-blue-500 text-white"
          //     : "bg-gray-300 text-gray-500 cursor-not-allowed"
          // }`}

          className={`py-2 px-4 ml-2 rounded-lg text-white font-semibold ${
            annotationType && currentAnnotation && videoTimestamp
              ? "bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!(annotationType && currentAnnotation && videoTimestamp)}
      >
          Add Annotation
        </button>
      </div>
      </form>



      
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
        <button className='px-2 py-4 bg-green-300 rounded-2xl' onClick={handleVideoUpload}>Upload Video</button>
      </div>
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