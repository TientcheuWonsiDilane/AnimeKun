import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from './assets/logo.png';
import { VOTING_CATEGORIES, CATEGORY_CONFIG, MAL_BASE_IMAGE, MAL_BASE_CHAR } from './data';

const getImgUrl = (path) => `${MAL_BASE_IMAGE}/${path}.webp`;
const getCharUrl = (path) => `${MAL_BASE_CHAR}/${path}.webp`;

const Voting = () => {
  const [backendData, setBackendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllVotes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/all-votes');
        setBackendData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setLoading(false);
      }
    };
    fetchAllVotes();
  }, []);

  const getCategoryWinner = (catId) => {
    const localList = VOTING_CATEGORIES[catId] || [];
    
   if (!backendData || backendData.length === 0) {
    const defaultSorted = [...localList].sort((a, b) => a.id - b.id);
    return defaultSorted[0];
  }

  const merged = localList.map((item) => {
    const match = backendData.find(b => 
      String(b.id) === String(item.id) && 
      String(b.category) === String(catId)
    );

    return {
      ...item,
      votes: match ? match.votes : 0
    };
  });

  const sorted = [...merged].sort((a, b) => {
    if (b.votes !== a.votes) {
      return b.votes - a.votes;
    }
    return a.id - b.id; 
  });

  return sorted[0];
};
  if (loading) return <div>Loading Rankings...</div>;

  return (
    <div className="min-h-screen bg-[#ddd] pb-24">
      <div 
        className="relative pt-32 pb-40 text-center bg-black text-white overflow-hidden mb-10 h-[60vh] lg:h-[70vh]"
        style={{ 
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://www.tvguide.com/a/img/resize/6a1b0ca1f2b2d682a4e6d22b8380422a4adac7fa/hub/2026/04/02/893315af-834e-464b-906a-476bbb8f2199/260402-animeawards-collage.jpg?auto=webp&width=1092)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex justify-center mb-2">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <img src={logo} className="w-full h-full object-cover" alt="Logo" />
          </div>
        </div>

        <h1 className="text-2xl md:text-4xl lg:text-6xl font-black italic tracking-tighter drop-shadow-2xl">
          Vote for the best anime in each <span className="text-yellow-400">Categorie</span>
        </h1>
        <p className="max-w-xl mx-auto mt-4 font-bold text-[10px] tracking-[0.4em] opacity-80">
          Will you be the one to decide?
        </p>
      </div>

      <div className="text-center w-4/5 mx-auto text-grey/70 font-bold text-xl tracking-widest mb-16 border-b-2 border-black pb-4">
        Vote for your favorites in each category. You have 500 points per category to distribute each week! You can put them all on one anime or spread them out. Happy voting!
      </div>

      <div className="space-y-20 md:space-y-32 px-4 md:px-30 max-w-7xl mx-auto md:py-30">
        {CATEGORY_CONFIG.map((conf) => {
          const winner = getCategoryWinner(conf.id);
          
          return (
            <Link to={`/vote/${conf.id}`} key={conf.id} className="block group mb-15 lg:mb-30">
              <div className="relative lg:h-56 h-46 w-full border-2 rounded-lg border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gray-900 overflow-visible transition-all group-hover:translate-x-2 group-hover:translate-y-2 group-hover:shadow-none duration-500">
                
                <div className="absolute inset-0 z-0">
                  {winner && (
                    <img src={getImgUrl(winner.img)} className="w-full h-full object-cover opacity-60 lg:grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                </div>

                {winner && winner.chars && (
                  <img 
                    src={getCharUrl(winner.chars[0])} 
                    className="absolute -left-1 w-[40%] bottom-0 h-[110%] lg:h-[140%] lg:w-[21%] object-cover z-20 border-t-2 border-l-2 rounded-lg border-r-2 border-b-1 border-black transition-all duration-500 group-hover:scale-105" 
                    alt="Winner"
                  />
                )}

                <div className="relative z-10 flex flex-col justify-center h-full pl-44 md:pl-72">
                  <h3 className="text-yellow-400 font-black text-xs tracking-widest mb-2 italic">
                    Leading: {winner?.name || "Loading..."}
                  </h3>
                  <h2 className="text-white text-xl md:text-3xl font-black uppercase italic tracking-tighter leading-none group-hover:text-blue-400 transition-colors">
                    {conf.title}
                  </h2>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="h-[2px] w-12 bg-white/30 group-hover:w-20 transition-all"></div>
                    <span className="text-white/50 font-black text-[10px] uppercase tracking-widest">Click to Vote</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Voting;