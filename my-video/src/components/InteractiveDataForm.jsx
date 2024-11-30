// src/components/InteractiveDataForm.jsx
import React, { useState } from "react";

const InteractiveDataForm = ({ currentTime, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    onSubmit(currentTime, { title, content });
    setTitle("");
    setContent("");
  };

  return (
    <div>
      <h4>Inject Data at Time: {currentTime.toFixed(2)}s</h4>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter Content"
      />
      <button onClick={handleSubmit}>Submit Data</button>
    </div>
  );
};

export default InteractiveDataForm;
