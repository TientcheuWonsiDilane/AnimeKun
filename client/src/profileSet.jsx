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
        <h1 className=" text-4xl mb-8 font-black/100 tracking-wider">Last Step!</h1>
        <div className="mb-6">
          <label className="block font-black mb-2">Username</label>
          <input className="w-full border-2 rounded-sm border-black p-3 outline-none focus:bg-yellow-100 font-bold" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username..." />
        </div>
        <div className="mb-8">
          <label className="block font-black  mb-2">Avatar URL</label>
          <input className="w-full border-2 rounded-sm border-black p-3 outline-none focus:bg-blue-100 font-bold" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        </div>
        <button onClick={handleSubmit} className="w-full rounded-[10px] bg-black text-white py-4 font-black hover:bg-white hover:text-black border-1 border-black transition-all active:border-transparent">Enter the Arena</button>
      </div>
      <div className="hidden lg:block lg:w-[70%] h-full border-l-4 border-black">
        <img src={onePieceImg} className="w-full h-full object-cover" alt="One Piece" />
      </div>
    </div>
  );
};

export default ProfileSetup;