import React, { useState } from 'react';

const AnnotationForm = ({ handleAddAnnotation }) => {
  const [type, setType] = useState('prompt');
  const [content, setContent] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content && timestamp) {
      const newAnnotation = {
        id: Date.now(),
        type,
        content,
        timestamp: parseFloat(timestamp),
        isAnswered: false,
      };
      handleAddAnnotation(newAnnotation);
      setContent('');
      setTimestamp('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="p-2 mb-4 w-full border border-gray-300 rounded"
      >
        <option value="prompt">Prompt</option>
        <option value="question">Question</option>
        <option value="feedback">Feedback</option>
      </select>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="p-2 mb-4 w-full border border-gray-300 rounded"
        placeholder="Annotation content"
      />
      <input
        type="number"
        value={timestamp}
        onChange={(e) => setTimestamp(e.target.value)}
        className="p-2 mb-4 w-full border border-gray-300 rounded"
        placeholder="Timestamp (in seconds)"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Add Annotation
      </button>
    </form>
  );
};

export default AnnotationForm;
