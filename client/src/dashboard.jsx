import React from 'react';

const Dashboard = ({ user }) => {
  if (!user) return <div className="pt-40 text-center font-black">PLEASE LOGIN</div>;

  return (
    <div className="min-h-screen pt-32 px-6 md:px-16 bg-white font-['Poppins']">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16 p-8 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <img src={user.avatar} className="w-32 h-32 rounded-full border-4 border-black" alt="avatar" />
        <div>
          <h1 className="font-['Kanit'] text-5xl font-black uppercase">{user.username}</h1>
          <p className="font-bold text-gray-500">{user.email}</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10">
        <div className="border-4 border-black p-6">
          <h2 className="font-['Kanit'] text-3xl font-black uppercase mb-6 bg-yellow-300 inline-block px-2">Watchlist</h2>
          <div className="text-gray-400 italic">No anime added yet.</div>
        </div>
        <div className="border-4 border-black p-6">
          <h2 className="font-['Kanit'] text-3xl font-black uppercase mb-6 bg-red-400 inline-block px-2">Favorites</h2>
          <div className="text-gray-400 italic">No favorites yet.</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;