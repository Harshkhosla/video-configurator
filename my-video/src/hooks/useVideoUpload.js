import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config/apiConfig';

const useVideoUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const uploadVideo = async (videoFilebolb, annotations) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('video', videoFilebolb);
    formData.append('annotations', JSON.stringify(annotations));

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        toast.success('Video uploaded successfully');
        setSuccess(true);
      }
    } catch (err) {
      setError('Video upload failed. Please try again.');
      toast.error('Video upload failed');
    } finally {
      setLoading(false);
    }
  };

  return { uploadVideo, loading, error, success };
};

export default useVideoUpload;
