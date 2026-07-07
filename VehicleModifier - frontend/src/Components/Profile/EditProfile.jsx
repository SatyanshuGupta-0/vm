import React, { useEffect, useState, useRef } from 'react';
import { fetchDataFromApi, putData, postData } from '../../utils/api';

const EditProfile = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    mobile: '',
    address_line: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    avatar: '',
  });

  const [avatarPublicId, setAvatarPublicId] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const userRes = await fetchDataFromApi('/api/user/user-details');
      const addressRes = await fetchDataFromApi('/api/address');

      if (userRes?.data) {
        const { _id, name, email, mobile, avatar } = userRes.data;
        setFormData((prev) => ({
          ...prev,
          userId: _id,
          name,
          email,
          mobile,
          avatar: avatar?.url || '/default-avatar.png',
        }));
        setAvatarPublicId(avatar?.publicId || null);
      }

      if (addressRes?.data?.length > 0) {
        const addr = addressRes.data[0];
        setAddressId(addr._id);
        setFormData((prev) => ({
          ...prev,
          address_line: addr.address_line || '',
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.pincode || '',
          country: addr.country || '',
        }));
      }
    } catch (err) {
      console.error('Failed to load profile or address:', err);
      alert('Failed to load profile data.');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith('image/')) {
      alert('Only image files are allowed.');
      return;
    }
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatar: previewUrl }));
  };

  const deleteOldAvatar = async (publicId) => {
    try {
      await postData('/api/cloudinary/delete', { publicId });
    } catch (err) {
      console.error('Error deleting avatar:', err);
    }
  };

  const uploadNewAvatar = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: fd,
    });
    const data = await res.json();

    if (!data?.secure_url) throw new Error('Avatar upload failed');
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let avatarToUpdate;

      if (avatarFile) {
        const newAvatar = await uploadNewAvatar(avatarFile);
        avatarToUpdate = newAvatar;
        if (avatarPublicId) {
          await deleteOldAvatar(avatarPublicId);
        }
      } else if (formData.avatar === '/default-avatar.png' && avatarPublicId) {
        await deleteOldAvatar(avatarPublicId);
        avatarToUpdate = null;
      } else {
        avatarToUpdate = undefined;
      }

      await putData(`/api/user/${formData.userId}`, {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        ...(avatarToUpdate !== undefined && { avatar: avatarToUpdate }),
      });

      const addressPayload = {
        address_line: formData.address_line,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        mobile: formData.mobile,
      };

      if (addressId) {
        await putData(`/api/address/${addressId}`, addressPayload);
      } else {
        await postData('/api/address', addressPayload);
      }

      onSave(formData);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-8 relative max-h-[95vh] overflow-y-auto transition-all">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-black hover:text-red-500 text-4xl"
        >
          &times;
        </button>

        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Edit Profile</h2>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Avatar */}
          <div className="flex flex-col items-center md:w-1/3">
            <div className="relative">
              <img
                src={formData.avatar || '/default-avatar.png'}
                alt="avatar"
                className="w-48 h-48 rounded-full object-cover shadow-xl border-4 border-white hover:scale-105 transition-transform duration-300"
                onClick={() => fileInputRef.current.click()}
                style={{ cursor: 'pointer' }}
              />
              {formData.avatar !== '/default-avatar.png' && (
                <button
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, avatar: '/default-avatar.png' }));
                    setAvatarFile(null);
                  }}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-md hover:bg-red-700"
                  title="Remove"
                >
                  ✕
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <p className="text-sm text-gray-500 mt-3">Click image to change</p>
          </div>

          {/* Inputs */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              'name',
              'email',
              'mobile',
              'address_line',
              'city',
              'state',
              'pincode',
              'country',
            ].map((key) => (
              <div key={key}>
                <label className="block mb-1 text-gray-700 font-semibold">
                  {key.replace('_', ' ').toUpperCase()}
                </label>
                <input
                  type={key === 'email' ? 'email' : 'text'}
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder={`Enter ${key.replace('_', ' ')}`}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-10 w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 transition duration-300 shadow-lg"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
