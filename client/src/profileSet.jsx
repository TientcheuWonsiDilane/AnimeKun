import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import onePieceImg from './assets/img1.jpg';

const ProfileSetup = ({ user, onComplete }) => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.put('http://localhost:5000/api/auth/update-profile', 
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
        <h1 className="font-['Kanit'] text-4xl font-black mb-8 uppercase">Last Step!</h1>
        <div className="mb-6">
          <label className="block font-black uppercase mb-2">Username</label>
          <input className="w-full border-4 border-black p-3 outline-none focus:bg-yellow-100 font-bold" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username..." />
        </div>
        <div className="mb-8">
          <label className="block font-black uppercase mb-2">Avatar URL</label>
          <input className="w-full border-4 border-black p-3 outline-none focus:bg-blue-100 font-bold" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        </div>
        <button onClick={handleSubmit} className="w-full bg-black text-white py-4 font-black uppercase hover:bg-white hover:text-black border-4 border-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none">Enter the Arena</button>
      </div>
      <div className="hidden lg:block lg:w-[70%] h-full border-l-4 border-black">
        <img src={onePieceImg} className="w-full h-full object-cover" alt="One Piece" />
      </div>
    </div>
  );
};

export default ProfileSetup;