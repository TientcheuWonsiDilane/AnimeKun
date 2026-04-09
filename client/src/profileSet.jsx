import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import onePieceImg from './assets/img1.jpg';
// Import Camera icon if you are using Lucide-React or similar
import { Camera } from 'lucide-react'; 

const ProfileSetup = ({ user, onComplete }) => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [uploading, setUploading] = useState(false); 
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/db2aanter/image/upload',
        formData
      );
      setAvatar(res.data.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put('https://animekun-production.up.railway.app/api/auth/update-profile', 
        { username, avatar },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      onComplete(res.data);
      navigate('/');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex h-screen w-full font-['Poppins'] bg-white">
      <div className="w-full lg:w-[30%] h-full flex flex-col justify-center p-10">
        <h1 className=" text-4xl mb-8 font-black/100 tracking-wider">Last Step!</h1>
        <div className="mb-6">
          <label className="block font-black mb-2">Username</label>
          <input className="w-full border-2 rounded-sm border-black p-3 outline-none focus:bg-yellow-100 font-bold" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username..." />
        </div>
        
        <div className="mb-8">
          <label className="block font-black text-xs mb-2">Profile Picture</label>
          <div className="relative border-2 border-black border-dashed p-4 flex flex-col items-center hover:bg-gray-50 transition-colors">
            {avatar && !uploading && (
              <img src={avatar} alt="Preview" className="w-12 h-12 rounded-full mb-2 object-cover border border-black" />
            )}
            
            <input 
              type="file" 
              onChange={handleFileUpload} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              disabled={uploading}
            />
            <Camera className="mb-2" />
            <span className="text-xs font-bold">
              {uploading ? "Uploading..." : "Click to Upload New Image"}
            </span>
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={uploading}
          className={`w-full rounded-[10px] bg-black text-white py-4 font-black border-1 border-black transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black active:border-transparent'}`}
        >
          {uploading ? "Waiting for Image..." : "Enter the Arena"}
        </button>
      </div>
      <div className="hidden lg:block lg:w-[70%] h-full border-l-4 border-black">
        <img src={onePieceImg} className="w-full h-full object-cover" alt="One Piece" />
      </div>
    </div>
  );
};

export default ProfileSetup;