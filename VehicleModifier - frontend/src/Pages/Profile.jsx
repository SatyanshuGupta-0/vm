// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { fetchDataFromApi, postData, deleteData } from '../utils/api';
// import EditProfile from '../Components/Profile/EditProfile';

// const Profile = () => {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState({ name: '', email: '', avatar: '' });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [showEditPopup, setShowEditPopup] = useState(false);


//    const handleLogout = async () => {
//       try {
//         const response = await fetchDataFromApi("/api/user/logout", {
//           withCredentials: true,
//         });

//         if (response.success) {
//           localStorage.removeItem("accesstoken");
//           localStorage.removeItem("refreshtoken");
//           localStorage.removeItem("userEmail");
//           localStorage.removeItem("actionType");

//           // setIslogin(false);
//           navigate("/login");
//         } else {
//           console.error("Logout failed.");
//         }
//       } catch (error) {
//         console.error("Logout error:", error);
//       }
//     };

//   useEffect(() => {
//     const token = localStorage.getItem('accesstoken');
//     if (!token) {
//       navigate('/login');
//     } else {
//       fetchUserProfile();
//     }
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       const res = await fetchDataFromApi('/api/user/user-details', { withCredentials: true });
//       if (res?.data) {
//         const { name, email, avatar } = res.data;
//         setUserData({ name, email, avatar });
//       }
//     } catch (error) {
//       console.error('Failed to fetch user profile:', error);
//     }
//   };

//   const handleAvatarUpload = async () => {
//     if (!selectedFile) return;
//     setUploading(true);

//     const formData = new FormData();
//     formData.append('file', selectedFile);
//     formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
//     formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

//     try {
//       const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();
//       const imageUrl = data.secure_url;

//       // Save to your backend
//       const saveRes = await postData('/api/user/user-avatar', { avatarUrl: imageUrl }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
//         },
//       });

//       if (saveRes?.data?.success) {
//         setUserData((prev) => ({ ...prev, avatar: imageUrl }));
//         setSelectedFile(null);
//         setPreviewUrl(null);
//       }
//     } catch (error) {
//       console.error('Failed to upload avatar:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleDeleteAvatar = async () => {
//     try {
//       const res = await deleteData('/api/user/delete-avatar', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
//         },
//       });
//       if (res?.success) {
//         setUserData({ ...userData, avatar: '' });
//       }
//     } catch (error) {
//       console.error('Failed to delete avatar:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6 mt-12">
//       {showEditPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl shadow-2xl relative">
//             <EditProfile
//               userData={userData}
//               onClose={() => setShowEditPopup(false)}
//               onSave={(updatedData) => setUserData((prev) => ({ ...prev, ...updatedData }))}
//             />
//           </div>
//         </div>
//       )}
//       <div className="flex items-center space-x-4">
//         <div className="relative group">
//           <img
//             src={
//               previewUrl ||
//               userData.avatar?.url ||
//               ''
//             }
//             alt=""
//             className="min-w-20 max-w-20 h-20 rounded-full border-2 border-gray-300 object-cover cursor-pointer"
//             onClick={() => document.getElementById('avatarInput').click()}
//           />


//         </div>
//         <div>
//           <h1 className="text-lg font-semibold">{userData.name}</h1>
//           <p className="text-sm text-gray-600">{userData.email}</p>
//         </div>
//       </div>

//       <div className="mt-2">
//         <button
//           onClick={() => setShowEditPopup(true)}
//           className="px-2 py-2  text-green-600 border hover:text-white hover:bg-green-600  rounded-md"
//         >
//           Edit Profile
//         </button>
//       </div>


//       <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
//         <Link to="/wishlist">
//           <div className="rounded-lg p-4 h-32 border border-black border-opacity-10 text-black text-opacity-85  hover:bg-gray-100 text-center shadow-md">
//             <div className="text-3xl mb-2">📜</div>
//             <h2 className="text-md font-semibold">Wishlist</h2>
//           </div>
//         </Link>
//         <Link to="/order">
//           <div className="rounded-lg p-4 h-32 border border-black border-opacity-10 text-black text-opacity-85  hover:bg-gray-100  text-center shadow-md">
//             <div className="text-3xl mb-2">📦</div>
//             <h2 className="text-md font-semibold">Orders</h2>
//           </div>
//         </Link>
//         {/*  */}
//         <Link to="/cart">
//           <div className="rounded-lg p-4 h-32 border border-black border-opacity-10 text-black text-opacity-85  hover:bg-gray-100  text-center shadow-md">
//             <div className="text-3xl mb-2">🛒</div>
//             <h2 className="text-md font-semibold">Cart</h2>
//           </div>
//         </Link>
//         <Link to="/changepassword">
//           <div className="rounded-lg p-4 h-32 border border-black border-opacity-10 text-black text-opacity-85  hover:bg-gray-100  text-center shadow-md">
//             <div className="text-3xl mb-2">🔒</div>
//             <h2 className="text-md font-semibold">Change Password</h2>
//           </div>
//         </Link>

//       </div>
//       <div className="mt-6">
//         <button
//           onClick={() => handleLogout()}
//           className="px-4 py-2 text-md border-2 hover:text-white hover:bg-black rounded-full text-black"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDataFromApi, postData, deleteData } from '../utils/api';
import EditProfile from '../Components/Profile/EditProfile';
import SharePopup from '../Components/SharePopup';
import { IoMdShare } from "react-icons/io";
import { FaWallet } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', email: '', avatar: '', referralCode: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await fetchDataFromApi("/api/user/logout", { withCredentials: true });
      if (response.success) {
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("actionType");
        navigate("/login");
      } else {
        console.error("Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Fetch profile data
  useEffect(() => {
    const token = localStorage.getItem('accesstoken');
    if (!token) {
      navigate('/login');
    } else {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await fetchDataFromApi('/api/user/user-details', { withCredentials: true });
      if (res?.data) {
        const { name, email, avatar, referralCode } = res.data;
        setUserData({ name, email, avatar, referralCode });
        if (referralCode) localStorage.setItem("referralCode", referralCode);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  // Avatar upload
  const handleAvatarUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      const imageUrl = data.secure_url;
      const saveRes = await postData('/api/user/user-avatar', { avatarUrl: imageUrl }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accesstoken')}` },
      });
      if (saveRes?.data?.success) {
        setUserData((prev) => ({ ...prev, avatar: imageUrl }));
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  // Avatar delete
  const handleDeleteAvatar = async () => {
    try {
      const res = await deleteData('/api/user/delete-avatar', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accesstoken')}` },
      });
      if (res?.success) setUserData({ ...userData, avatar: '' });
    } catch (error) {
      console.error('Failed to delete avatar:', error);
    }
  };

  // Referral link
  const referralLink = `${window.location.origin}/signup?ref=${userData.referralCode}`;

  return (
    <div className="container mx-auto p-6 mt-12">
      {/* Edit Profile Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl relative">
            <EditProfile
              userData={userData}
              onClose={() => setShowEditPopup(false)}
              onSave={(updatedData) => setUserData((prev) => ({ ...prev, ...updatedData }))}
            />
          </div>
        </div>
      )}

      {/* Share Popup */}
      {showSharePopup && (
        <SharePopup
          url={referralLink}
          title="Join VM Modifire with my referral code!"
          onClose={() => setShowSharePopup(false)}
        />
      )}

      {/* Profile Info */}
      <div className="flex items-center space-x-4">
        <div className="relative group">
          <img
            src={previewUrl || userData.avatar?.url || ''}
            alt=""
            className="min-w-20 max-w-20 h-20 rounded-full border-2 border-gray-300 object-cover cursor-pointer"
            onClick={() => document.getElementById('avatarInput').click()}
          />
        </div>
        <div>
          <h1 className="text-lg font-semibold">{userData.name}</h1>
          <p className="text-sm text-gray-600">{userData.email}</p>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="mt-2">
        <button
          onClick={() => setShowEditPopup(true)}
          className="px-2 py-2 text-green-600 border hover:text-white hover:bg-green-600 rounded-md"
        >
          Edit Profile
        </button>
      </div>


      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <Link to="/wishlist">
          <div className="rounded-lg p-4 h-32 border border-black border-opacity-10 text-black text-opacity-85 hover:bg-gray-100 text-center shadow-md">
            <div className="text-3xl mb-2">📜</div>
            <h2 className="text-md font-semibold">Wishlist</h2>
          </div>
        </Link>
        <Link to="/order">
          <div className="rounded-lg p-4 h-32 border border-black border-opacity-10 text-black text-opacity-85 hover:bg-gray-100 text-center shadow-md">
            <div className="text-3xl mb-2">📦</div>
            <h2 className="text-md font-semibold">Orders</h2>
          </div>
        </Link>
        <Link to="/cart">
          <div className="rounded-lg p-4 h-32 border border-black border-opacity-10 text-black text-opacity-85 hover:bg-gray-100 text-center shadow-md">
            <div className="text-3xl mb-2">🛒</div>
            <h2 className="text-md font-semibold">Cart</h2>
          </div>
        </Link>
        <Link to="/changepassword">
          <div className="rounded-lg p-4 h-32 border border-black border-opacity-10 text-black text-opacity-85 hover:bg-gray-100 text-center shadow-md">
            <div className="text-3xl mb-2">🔒</div>
            <h2 className="text-md font-semibold">Change Password</h2>
          </div>
        </Link>
       


      </div>

      {/* Referral Share */}
      <div className="mt-6 flex items-center space-x-2">
        <input
          type="text"
          value={referralLink}
          readOnly
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={() => setShowSharePopup(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-1"
        >
          <IoMdShare /> <span>Share</span>
        </button>
      </div>

        <Link to="/wallet">
          <div className="rounded-lg mt-4 p-4 h-32 border border-black border-opacity-10 text-black text-opacity-85 hover:bg-gray-100 text-center shadow-md">
            <div className="text-3xl mb-2">
              <FaWallet size={40} className="mx-auto text-emerald-500 mb-2" />
            </div>
            <h2 className="text-md font-semibold">Wallet Balance</h2>
            <p>0 rs</p>
          </div>
        </Link>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <Link to="/teammembers">
          <div className="rounded-lg p-4 h-32 border border-black border-opacity-10 text-black text-opacity-85 hover:bg-gray-100 text-center shadow-md">
            <div className="text-3xl mb-2">🔒</div>
            <h2 className="text-md font-semibold">Team Members</h2>
          </div>
        </Link>
      </div>

      {/* Logout */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-md border-2 hover:text-white hover:bg-black rounded-full text-black"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
