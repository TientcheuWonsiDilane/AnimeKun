import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import logo from './assets/logo.png';
import { VOTING_CATEGORIES, CATEGORY_CONFIG, MAL_BASE_IMAGE, MAL_BASE_CHAR } from './data';

      export default function VoteDetails({ currentUser }) {
  const { categoryId } = useParams();
  const currentId = categoryId;
  
  const categoryInfo = CATEGORY_CONFIG.find(c => c.id === currentId);
  
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [animes, setAnimes] = useState([]);
  const [pointsLeft, setPointsLeft] = useState(500);
  
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

  const fetchAndMergeData = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/votes/${currentId}`);
      const backendVotes = res.data;

      const localData = VOTING_CATEGORIES[currentId] || [];

      const mergedData = localData.map(localItem => {
        const match = backendVotes.find(v => v.id === localItem.id);
        return {
        ...localItem,
        votes: match ? match.votes : 0,
        originalIndex: localItem.id 
      };
    });

    const sorted = mergedData.sort((a, b) => {
      if (b.votes !== a.votes) {
        return b.votes - a.votes; 
      }
      return a.originalIndex - b.originalIndex;
    });

    setAnimes(sorted);
    } catch (err) {
      console.error("Sync error:", err);
      setAnimes(VOTING_CATEGORIES[currentId] || []);
    }
  }, [currentId]);

  useEffect(() => {
    fetchAndMergeData();
    const lastVoteTime = localStorage.getItem(`firstVoteTime_${currentId}`);
    const savedPoints = localStorage.getItem(`points_${currentId}`);
    const now = Date.now();

    if (lastVoteTime && (now - parseInt(lastVoteTime) > SEVEN_DAYS)) {
      setPointsLeft(500);
      localStorage.setItem(`points_${currentId}`, "500");
      localStorage.removeItem(`firstVoteTime_${currentId}`);
    } else if (savedPoints !== null) {
      setPointsLeft(parseInt(savedPoints));
    }
  }, [currentId, fetchAndMergeData]);

  const handleFinalVote = async (id) => {
    if (!currentUser) return alert("Login required!");
    if (pointsLeft <= 0) return alert("No points left!");

    try {
      const res = await axios.post('http://localhost:5000/api/vote', {
        animeId: id,
        userId: currentUser._id,
        categoryId: currentId
      });

      if (res.data.success) {
        const newPoints = pointsLeft - 100;
        setPointsLeft(newPoints);
        localStorage.setItem(`points_${currentId}`, newPoints.toString());
        if (!localStorage.getItem(`firstVoteTime_${currentId}`)) {
          localStorage.setItem(`firstVoteTime_${currentId}`, Date.now().toString());
        }
        fetchAndMergeData(); 
        setSelectedAnime(null); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Voting failed");
    }
  };

  const getImgUrl = (path) => `${MAL_BASE_IMAGE}/${path}.webp`;
  const getCharUrl = (path) => `${MAL_BASE_CHAR}/${path}.webp`;

  if (animes.length === 0) return <div className="p-20 text-center font-black text-3xl italic">LOADING DATA...</div>;

  return (
    <div className="bg-[#ddd] min-h-screen text-slate-900 pb-20 overflow-x-hidden">
      <div 
        className="relative pt-32 pb-40 text-center bg-black text-white overflow-hidden mb-10 h-[60vh] lg:h-[70vh]"
        style={{ 
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${getImgUrl(animes[0].img)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex justify-center mb-2">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <img src={logo} className="w-full h-full object-cover" alt="Icon" />
          </div>
        </div>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-black italic tracking-tighter drop-shadow-2xl">
          RANKING: <span className="text-yellow-400 uppercase">{categoryInfo?.title || "CATEGORY"}</span>
        </h1>
        <p className="max-w-xl mx-auto mt-4 font-bold text-[10px] tracking-[0.4em] opacity-80 uppercase">
          The current community standing
        </p>
      </div>

      <div className="text-center w-9/10 mx-auto text-grey/70 font-bold text-xl tracking-widest mb-6 border-b-2 border-black pb-4 mb-9">
      {categoryInfo?.title} as voted by the community: <span className="text-yellow-400">{animes[0]?.name}.</span><br />
        Click "VOTE" to support your favorite!
      </div>
        <div className="text-center text-xl border-2 border-black px-9 py-3 w-[70%] lg:w-[25%] rounded-lg mx-auto font-bold text-yellow-400 mb-16 md:mb-36">
          Points Left: {pointsLeft < 0 ? "0" :(currentUser) ? pointsLeft : "[ Login to Vote! ]"}
        </div>
      <div className="space-y-12 lg:space-y-32 px-1 md:px-20 max-w-7xl mx-auto">
        {animes.map((anime, index) => {
          const isTop3 = index < 3;

          if (isTop3) {
            return (
                <div key={anime.id} className="block group">
              <div className="relative h-70 items-center border-2 rounded-lg border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gray-900 overflow-visible transition-all">
                
                <div className="absolute inset-0 z-0">
                  <img src={getImgUrl(anime.img)} loading="lazy" className="w-full h-full object-cover opacity-60 transition-all duration-500" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                </div>

                <img 
                  src={getCharUrl(anime.chars[0])} 
                  className="absolute -left-1 w-[50%] bottom-0 h-[110%] lg:h-[140%] lg:w-[25%] object-cover z-20 border-t-2 border-l-2 rounded-lg border-r-2 border-b-1 border-black transition-all duration-500 group-hover:scale-105" 
                  alt=""
                />

                <div className="relative z-10 flex flex-col justify-center align-center h-full pl-48 md:pl-80 gap-2 pt-4 pb-4">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-yellow-400 font-black text-5xl tracking-widest mb-1 italic">#{index + 1}</h3>
                      <h2 className="text-white text-xl md:text-3xl font-black italic tracking-tighter leading-none">
                        {anime.name}
                      </h2>
                      <p className="text-white/50 font-bold text-[11px] uppercase tracking-[0.2em] mt-1">
                        Credibility: {anime.votes.toLocaleString()}
                      </p>
                    </div>
                    
                  </div>

                  <div className="lg:h-[70%] flex gap-1 md:gap-1 justify-center lg:justify-start items-end lg:items-center">
                    {anime.chars.slice(0,3).map((c, i) => (
                      <div key={i} className="w-12 h-16 md:w-20 md:h-24 border border-black/50 overflow-hidden skew-x-[-9deg]">
                        <img src={getCharUrl(c)} className="w-full h-full object-cover" alt="char" />
                      </div>
                    ))}

                  </div>
                  <button 
                       onClick={() => setSelectedAnime(anime)}
                       className="bg-yellow-400 hover:bg-white text-black mt-3 lg:mt-0 font-black py-2 w-38 lg:w-58 skew-x-[-14deg] transition-all"
                    >
                      VOTE
                    </button>
                </div>
              </div>
            </div>
            );
          }

          return (
            <div key={anime.id} className="block group">
              <div className="relative lg:h-64 h-60 pt-4 pb-4 items-center border-2 rounded-lg border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gray-900 overflow-visible transition-all">
                
                <div className="absolute inset-0 z-0">
                  <img src={getImgUrl(anime.img)} className="w-full h-full object-cover opacity-60 transition-all duration-500" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                </div>

                <img 
                  src={getCharUrl(anime.chars[0])} 
                  className="absolute -left-1 w-[50%] bottom-0 h-[110%] lg:h-[120%] lg:w-[20%] object-cover z-20 border-t-2 border-l-2 rounded-lg border-r-2 border-b-1 border-black transition-all duration-500 group-hover:scale-105" 
                  alt=""
                />

                <div className="relative z-10 flex flex-col justify-center align-center h-full pl-48 md:pl-68 gap-2">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-yellow-400 font-black text-xs tracking-widest mb-1 italic">
                        Position #{index + 1}
                      </h3>
                      <h2 className="text-white text-xl md:text-3xl font-black italic tracking-tighter leading-none">
                        {anime.name}
                      </h2>
                      <p className="text-white/50 font-bold text-[11px] uppercase tracking-[0.2em] mt-1">
                        Credibility: {anime.votes.toLocaleString()}
                      </p>
                    </div>
                    
                  </div>

                  <div className="lg:h-[70%] flex gap-1 justify-center lg:justify-start items-end lg:items-center">
                    {anime.chars.slice(0,3).map((c, i) => (
                      <div key={i} className="w-12 h-16 md:w-20 md:h-24 border border-black/50 overflow-hidden skew-x-[-9deg]">
                        <img src={getCharUrl(c)} className="w-full h-full object-cover" alt="char" />
                      </div>
                    ))}

                  </div>
                  <button 
                       onClick={() => setSelectedAnime(anime)}
                       className="bg-yellow-400 active:bg-white hover:bg-white duration-500 text-black mt-3 lg:mt-0 font-black py-2 w-38 lg:w-58 skew-x-[-14deg] transition-all"
                    >
                      VOTE
                    </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedAnime && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAnime(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-white w-full max-w-md overflow-hidden z-20" style={{ clipPath: "polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)" }}>
              <img src={getImgUrl(selectedAnime.img)} className="w-full h-[400px] lg:h-[500px] object-cover" alt="" />
              <div className="p-8 bg-black text-white">
                <h2 className="text-xl lg:text-3xl  font-black italic leading-none">{selectedAnime.name}</h2>
                <button onClick={() => handleFinalVote(selectedAnime.id)} className="w-full active:bg-white hover:bg-white mt-6 bg-yellow-400 text-black font-black py-4 skew-x-[-9deg] italic transition-colors duration-500">Confirm Vote</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}