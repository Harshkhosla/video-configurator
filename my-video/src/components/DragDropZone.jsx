import React from "react";
import { useDropzone } from "react-dropzone";

const DragDropZone = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "video/*",
    onDrop: (acceptedFiles) => {
      onDrop(acceptedFiles[0]);  
    },
  });

  return (
    <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', width: '300px', margin: '20px auto' }}>
      <input {...getInputProps()} />
      <p>Drag and drop a video file here, or click to select one</p>
    </div>
  );
};

export default DragDropZone;
