import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AnimeDetail = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);

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

  if (!anime) return <div className="h-screen flex items-center justify-center font-black">LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-black font-['Poppins']">
      <div className="flex flex-col lg:flex-row">
        
        <div className="w-full lg:w-1/3 lg:h-screen lg:sticky lg:top-6 p-0 lg:p-10">
          <div className="relative w-full h-screen lg:h-full border-b-3 lg:border-3 border-black overflow-hidden">
            <img 
              src={anime.images.jpg.large_image_url} 
              alt={anime.title_english} 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/40 to-transparent bg-white/40 flex flex-row gap-3">
              <button className="w-full py-3 bg-[#2ecc71] border-2 border-black text-black font-black uppercase tracking-tighter rounded-sm hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-y-1">
                Add to MyList
              </button>
              <button className="w-full py-3 bg-[#e74c3c] border-2 border-black text-white font-black uppercase tracking-tighter rounded-sm hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-y-1">
                Add to Favorites
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 p-6 lg:p-20">
          <h1 className="font-['Kanit'] traking-wider text-2xl lg:text-5xl text-center lg:text-left font-black uppercase leading-none mb-6 border-b-3 border-black pb-2">
            {anime.title_english}
          </h1>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
            <span className="px-4 py-1 border-b-3 border-black font-bold uppercase rounded-full">Score: {anime.score}</span>
            <span className="px-4 py-1 border-b-3 border-black font-bold uppercase rounded-full">{anime.episodes} Episodes</span>
            <span className="px-4 py-1 border-b-3 border-black font-bold uppercase  rounded-full">{anime.status}</span>
          </div>

          <section className="mb-12">
            <h2 className="font-['Kanit'] text-2xl font-black uppercase border-b-4 border-black inline-block mb-4">Synopsis</h2>
            <p className="text-[14px] lg:text-lg leading-relaxed text-gray-700">{anime.synopsis}</p>
          </section>
        
        {/* Trailer Section */}
{anime.trailer?.embed_url && (
  <section className="mb-12">
    <h2 className="font-['Kanit'] text-2xl font-black uppercase border-b-4 border-black inline-block mb-6">
      Official Trailer
    </h2>
    <div className="relative w-full aspect-video border-0 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-black overflow-hidden">
      <iframe
        src={anime.trailer.embed_url}
        title="Anime Trailer"
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
  </section>
)}

          {/* Characters Section */}
          <section className="mb-12">
            <h2 className="font-['Kanit'] text-2xl font-black uppercase border-b-4 border-black inline-block mb-6">Main Characters</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {characters.map((char) => (
                <div key={char.character.mal_id} className="group cursor-pointer">
                  <div className="aspect-[2/3] overflow-hidden mb-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <img src={char.character.images.jpg.image_url} alt={char.character.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="font-black text-[10px] uppercase truncate">{char.character.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{char.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Author Section */}
          <section className="p-6 border-1 border-black bg-gray-50 flex flex-col md:flex-row items-center gap-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {anime.producers[0] && (
              <>
                <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-white shrink-0">
                  <div className="w-full h-full flex items-center justify-center font-black text-xs text-center p-2">
                    {anime.studios[0]?.name || "Studio"}
                  </div>
                </div>
                <div>
                  <h3 className="font-['Kanit'] text-xl font-black uppercase">Studio & Production</h3>
                  <p className="font-bold text-gray-600">Studio: {anime.studios.map(s => s.name).join(', ')}</p>
                  <p className="text-sm mt-2">Original Creator: {anime.producers[0]?.name || 'Unknown'}</p>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;