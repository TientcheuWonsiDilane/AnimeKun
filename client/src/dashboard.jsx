import React, { useState } from 'react';
import { User, Bookmark, Heart, Settings, Plus, X, Check, Trash2, Camera } from 'lucide-react';
import axios from 'axios';
import img2 from './assets/img2.jpg';

const Dashboard = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [uploading, setUploading] = useState(false);

  if (!user) return <div className="pt-40 text-center tracking-wider text-2xl min-h-screen font-black">PLEASE LOGIN</div>;

  const toggleList = async (anime, listType) => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/toggle-list', 
        { anime, listType },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setUser({ ...user, [listType]: res.data.data });
    } catch (err) { console.error(err); }
  };

  const toggleWatched = async (animeId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/toggle-watched', 
        { animeId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setUser({ ...user, watchlist: res.data.data });
    } catch (err) { console.error(err); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); 

    setUploading(true);
    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/db2aanter/image/upload", formData);
      const imageUrl = res.data.secure_url;
      updateProfile(newUsername, imageUrl);
    } catch (err) { console.error("Upload failed", err); }
    setUploading(false);
  };

  const updateProfile = async (username, avatarUrl) => {
    try {
      const res = await axios.put('http://localhost:5000/api/auth/update-profile', 
        { username, avatar: avatarUrl || user.avatar },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setUser(res.data);
      setShowEditModal(false);
    } catch (err) { console.error(err); }
  };

  const tabs = [
    { id: 'posts', label: 'Posts', icon: <Plus size={24} /> },
    { id: 'watchlist', label: 'Watchlist', icon: <Bookmark size={24} /> },
    { id: 'favorites', label: 'Favorites', icon: <Heart size={24} /> },
    { id: 'settings', label: 'Account', icon: <Settings size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      <div className="relative h-screen w-full overflow-hidden">
        <img src={img2} className="absolute inset-0 w-full h-full object-cover" alt="Background" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6">
          <img src={user.avatar} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl mb-4 object-cover" alt="Avatar" />
          <h1 className="tracking-widest text-4xl md:text-6xl drop-shadow-lg text-center">Welcome, {user.username}</h1>
          <button onClick={() => setShowEditModal(true)} className="mt-4 rounded-sm px-9 py-3 bg-black text-white tracking-widest text-lg duration-500 hover:opacity-85 active:opacity-75 transition-all">
            Edit Profile
          </button>
        </div>

        <div className="absolute bottom-0 w-full bg-white/10 backdrop-blur-md border-b-2 border-t-2 border-gray-400 flex justify-center py-1">
          <div className="flex gap-8 md:gap-16">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="relative flex flex-col items-center text-white group">
                <div className={`p-2 transition-transform ${activeTab === tab.id ? 'scale-125' : 'group-hover:scale-110'}`}>{tab.icon}</div>
                <span className="hidden md:block text-[12px] mt-1 tracking-widest">{tab.label}</span>
                {activeTab === tab.id && <div className="absolute -bottom-[6px] w-[150%] h-1 bg-black z-10 rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 px-6 md:px-16 min-h-[50vh]">
        {activeTab === 'watchlist' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {user.watchlist?.map((item) => (
              <div key={item.mal_id} className="relative h-36 border-1 border-black overflow-hidden group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <img src={item.image_url} className="w-full h-full object-cover" alt={item.title} />
                <div className="absolute inset-0 bg-black/30 opacity-100 group-hover:bg-black/50 transition-opacity flex flex-col justify-between p-4">
                  <h3 className="text-white font-black uppercase text-sm">{item.title}</h3>
                  <div className="flex justify-between items-center">
                    <button onClick={() => toggleWatched(item.mal_id)} className={`px-4 py-1 font-black text-[10px] uppercase border-2 border-white ${item.watched ? 'bg-[#2ecc71] text-black' : 'text-white'}`}>
                      {item.watched ? <Check size={14} className="inline mr-1" /> : ''} {item.watched ? 'Watched' : 'Mark Watched'}
                    </button>
                    <button onClick={() => toggleList(item, 'watchlist')} className="text-red-500 hover:scale-110 transition-transform"><Trash2 size={20} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {user.favorites?.map((item) => (
              <div key={item.mal_id} className="relative h-48 border-4 border-black overflow-hidden group shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <img src={item.image_url} className="w-full h-full object-cover" alt={item.title} />
                <div className="absolute inset-0 bg-black/20 opacity-100 group-hover:bg-black/50 flex flex-col justify-between p-4">
                  <h3 className="text-white font-black uppercase text-sm">{item.title}</h3>
                  <div className="flex justify-between items-center">
                    <button onClick={() => toggleList(item, 'favorites')} className="text-red-500 hover:scale-110 transition-transform"><Trash2 size={20} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-['Kanit'] text-3xl font-black uppercase mb-6 border-b-2 border-black">Settings</h2>
            <div className="space-y-4">
              <div className="flex justify-between font-bold"><span>Username:</span> <span>{user.username}</span></div>
              <div className="flex justify-between font-bold"><span>Email:</span> <span className="text-gray-400">{user.email}</span></div>
              <button onClick={() => setShowEditModal(true)} className="w-full py-3 bg-black text-white font-black uppercase mt-4">Modify Account Info</button>
            </div>
          </div>
        )}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white border-1 border-black w-full max-w-md p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className=" text-3xl tracking-wider font-black mb-6">Edit Profile</h2>
            <div className="space-y-6">
              <div>
                <label className="block font-black text-xs mb-2">New Username</label>
                <input 
                  type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full rounded-sm border-2 border-black p-3 font-bold focus:bg-yellow-100/20 outline-none"
                />
              </div>
              <div>
                <label className="block font-black text-xs mb-2">Profile Picture</label>
                <div className="relative border-2 border-black border-dashed p-4 flex flex-col items-center hover:bg-gray-50 transition-colors">
                  <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <Camera className="mb-2" />
                  <span className="text-xs font-bold">{uploading ? "Uploading..." : "Click to Upload New Image"}</span>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => updateProfile(newUsername)} className="rounded-sm flex-1 py-3 bg-black  text-white font-black hover:bg-white hover:text-black border-2 border-black transition-all active:border-transparent duration-500">Save</button>
                <button onClick={() => setShowEditModal(false)} className=" rounded-sm flex-1 py-3 border-2 border-black font-black hover:bg-black hover:text-white">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;