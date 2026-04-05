import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AnimeDetail = ({ user, setUser }) => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  
  const isInList = (listType) => user?.[listType]?.some(item => item.mal_id === Number(id));

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const animeRes = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
        const charRes = await axios.get(`https://api.jikan.moe/v4/anime/${id}/characters`);
        setAnime(animeRes.data.data);
        setCharacters(charRes.data.data.slice(0, 5));
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchFullData();
  }, [id]);

  const toggleList = async (listType) => {
    if (!user) return alert("Please login first");
    try {
      const res = await axios.post('http://localhost:5000/api/user/toggle-list', 
        { anime, listType },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setUser({ ...user, [listType]: res.data.data });
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!anime) return <div className="h-screen flex items-center justify-center font-black">LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-black font-['Poppins']">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 lg:h-screen lg:sticky lg:top-6 p-0 lg:p-10">
          <div className="relative w-full h-screen lg:h-full border-b-3 lg:border-3 border-black overflow-hidden">
            <img src={anime.images.jpg.large_image_url} alt={anime.title_english} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-row gap-3">
              <button 
                onClick={() => toggleList('watchlist')}
                className={`w-full py-3 border-2 border-black font-black uppercase tracking-tighter rounded-sm transition-all active:translate-y-1 ${isInList('watchlist') ? 'bg-gray-400' : 'bg-[#2ecc71] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
              >
                {isInList('watchlist') ? 'Remove from List' : 'Add to MyList'}
              </button>
              <button 
                onClick={() => toggleList('favorites')}
                className={`w-full py-3 border-2 border-black font-black uppercase tracking-tighter rounded-sm transition-all active:translate-y-1 ${isInList('favorites') ? 'bg-gray-400 text-black' : 'bg-[#e74c3c] text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
              >
                {isInList('favorites') ? 'Unfavorite' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 p-6 lg:p-20">
          <h1 className="font-['Kanit'] tracking-wider text-2xl lg:text-5xl text-center lg:text-left font-black uppercase leading-none mb-6 border-b-3 border-black pb-2">
            {anime.title_english || anime.title}
          </h1>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
            <span className="px-4 py-1 border-b-3 border-black font-bold uppercase rounded-full">Score: {anime.score}</span>
            <span className="px-4 py-1 border-b-3 border-black font-bold uppercase rounded-full">{anime.episodes} Episodes</span>
            <span className="px-4 py-1 border-b-3 border-black font-bold uppercase rounded-full">{anime.status}</span>
          </div>
          <section className="mb-12">
            <h2 className="font-['Kanit'] text-2xl font-black uppercase border-b-4 border-black inline-block mb-4">Synopsis</h2>
            <p className="text-[14px] lg:text-lg leading-relaxed text-gray-700">{anime.synopsis}</p>
          </section>

          {anime.trailer?.embed_url && (
            <section className="mb-12">
              <h2 className="font-['Kanit'] text-2xl font-black uppercase border-b-4 border-black inline-block mb-6">Official Trailer</h2>
              <div className="relative w-full aspect-video border-0 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-black overflow-hidden">
                <iframe src={anime.trailer.embed_url} title="Anime Trailer" className="absolute inset-0 w-full h-full" allowFullScreen></iframe>
              </div>
            </section>
          )}

          <section className="mb-12">
            <h2 className="font-['Kanit'] text-2xl font-black uppercase border-b-4 border-black inline-block mb-6">Main Characters</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {characters.map((char) => (
                <div key={char.character.mal_id} className="group">
                  <div className="aspect-[2/3] overflow-hidden mb-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <img src={char.character.images.jpg.image_url} alt={char.character.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="font-black text-[10px] uppercase truncate">{char.character.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{char.role}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;