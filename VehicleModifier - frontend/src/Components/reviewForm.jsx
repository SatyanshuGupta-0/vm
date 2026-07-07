import React, { useState, useRef, useEffect } from 'react';
import { postData } from '../utils/api';

const ReviewForm = ({ productId }) => {
  const dropRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  const processFiles = selectedFiles => {
    const valid = Array.from(selectedFiles).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });

    if (valid.length !== selectedFiles.length) {
      setError('Some files were not images or videos.');
    } else {
      setError('');
    }

    const newPreviews = valid.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    setFiles(prev => [...prev, ...valid]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleDrop = e => {
    e.preventDefault();
    processFiles(e.dataTransfer.files);
  };

  const handleSelect = e => {
    processFiles(e.target.files);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (rating === 0) return setError('Please select a rating');

    setLoading(true);
    setError('');
    let uploadedMedia = [];

    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', uploadPreset);

        const endpoint = file.type.startsWith('video/')
          ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
          : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const res = await fetch(endpoint, {
          method: 'POST',
          body: fd,
        });

        const data = await res.json();
        if (!data.secure_url) throw new Error('Upload failed');

        uploadedMedia.push({
          url: data.secure_url,
          publicId: data.public_id, // needed for deletion/editing
          type: file.type.startsWith('video/') ? 'video' : 'image',
        });

      }

      await postData('/api/review', {
        productId,
        rating,
        reviewText,
        media: uploadedMedia,
      });

      // Reset
      setRating(0);
      setHover(0);
      setReviewText('');
      setFiles([]);
      previews.forEach(p => URL.revokeObjectURL(p.url));
      setPreviews([]);
    } catch (err) {
      setError(err.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = index => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index].url);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-full mx-auto">
      <h2 className="text-xl font-bold mb-4">Leave a Review</h2>

      {/* Rating */}
      <div className="flex justify-center mb-4" role="radiogroup" aria-label="Rating">
        {Array.from({ length: 5 }).map((_, i) => {
          const star = i + 1;
          return (
            <label
              key={star}
              className="cursor-pointer"
              role="radio"
              aria-checked={rating === star}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setRating(star)}
            >
              <input
                type="radio"
                name="rating"
                value={star}
                className="hidden"
                checked={rating === star}
                onChange={() => setRating(star)}
              />
              <span
                className={`text-2xl ${star <= (hover || rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            </label>
          );
        })}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Review text */}
      <textarea
        value={reviewText}
        onChange={e => setReviewText(e.target.value)}
        rows={4}
        className="w-full p-2 border rounded mb-4"
        disabled={loading}
        placeholder="Write your review…"
        required
      />

      {/* Dropzone */}
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => dropRef.current.querySelector('input[type=file]').click()}
        className="w-full h-36 border-2 border-dashed rounded flex items-center justify-center cursor-pointer mb-4"
      >
        <p className="text-center text-gray-600">Drag & drop images or videos here, or click to upload</p>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleSelect}
          className="hidden"
        />
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {previews.map((item, index) => (
            <div key={index} className="relative">
              {item.type.startsWith('image/') ? (
                <img src={item.url} alt="Preview" className="w-full h-24 object-cover rounded" />
              ) : (
                <video src={item.url} className="w-full h-24 object-cover rounded" muted />
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-0 right-0 text-white bg-black bg-opacity-50 rounded-full px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
