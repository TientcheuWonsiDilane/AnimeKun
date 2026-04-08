import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo4 from './assets/logo4.png';

const HomePage = ({ searchTermFromHeader }) => {
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [filteredAnime, setFilteredAnime] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedSeason, setSelectedSeason] = useState("spring");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (searchTermFromHeader) setSearchTerm(searchTermFromHeader);
  }, [searchTermFromHeader]);

  useEffect(() => {
    const fetchSeasonal = async () => {
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/seasons/${selectedYear}/${selectedSeason}?limit=10`);
        setSeasonalAnime(res.data.data);
      } catch (err) { console.error(err); }
    };
    const initFetch = async () => {
    await fetchSeasonal(); 
    
  
    setTimeout(() => {
      fetchExploreAnime("", 1, false);
    }, 400); 
  };
  initFetch();
  }, [selectedYear, selectedSeason]);

const GENRE_MAP = {
  "Action": 1,
  "Comedy": 4,
  "Drama": 8,
  "Fantasy": 10,
  "Award Winning": 46
};


const [isLoading, setIsLoading] = useState(false);


const fetchExploreAnime = async (query = "", pageNum = 1, append = false, genre = "All") => {
  if (isLoading) return; 
  setIsLoading(true);

  try {
    let endpoint = `https://api.jikan.moe/v4/anime?page=${pageNum}&limit=10&order_by=popularity`;
    if (query) endpoint += `&q=${encodeURIComponent(query)}`;
    
    const GENRE_MAP = { "Action": 1, "Comedy": 4, "Drama": 8, "Fantasy": 10, "Award Winning": 46 };
    if (genre !== "All" && GENRE_MAP[genre]) {
      endpoint += `&genres=${GENRE_MAP[genre]}`;
    }

    const res = await axios.get(endpoint);
    setFilteredAnime(prev => append ? [...prev, ...res.data.data] : res.data.data);
  } catch (err) {
    if (err.response?.status === 429) {
      console.warn("Rate limit hit, retrying...");
      setTimeout(() => fetchExploreAnime(query, pageNum, append, genre), 2000);
    }
  } finally {
    setIsLoading(false);
  }
};


useEffect(() => {
  const tracker = setTimeout(() => {
    setPage(1);
    fetchExploreAnime(searchTerm, 1, false, activeGenre);
  }, 500); 

  return () => clearTimeout(tracker);
}, [searchTerm, activeGenre]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchExploreAnime(searchTerm, nextPage, true);
  };

  useEffect(() => {
    if (seasonalAnime.length > 0) {
      const interval = setInterval(() => {
        setOpacity(0);
        setTimeout(() => { setCurrentIndex((prev) => (prev + 1) % 3); setOpacity(1); }, 1000);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [seasonalAnime]);

  return (
    <div className="bg-white min-h-screen font-['Poppins'] max-w-screen">
      <section className="border-b border-black flex h-[60vh] w-full lg:h-screen">
        <div className="w-1/3 h-full overflow-hidden">
          <img src={logo4} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div className="w-2/3 h-full relative bg-gray-100">
          <div className="absolute top-0 left-0 w-2/5 h-full bg-gradient-to-r from-white to-transparent z-10" />
          {seasonalAnime[currentIndex] && (
            <img src={seasonalAnime[currentIndex]?.images.webp.large_image_url} alt="Slideshow" className="w-full h-full object-cover object-top transition-opacity duration-1000" style={{ opacity: opacity }} />
          )}
        </div>
      </section>

      <section className="w-[90%] md:w-4/5 mx-auto py-16">
        <h1 className="font-['Kanit'] text-2xl lg:text-4xl font-black text-center border-b-2 border-black pb-2 mb-12 uppercase tracking-wider">Animes of the Season</h1>
        <div className="mb-10 flex flex-wrap justify-center gap-4">
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-white border-1 border-black px-6 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {[2026, 2025, 2024, 2023].map(year => <option key={year} value={year}>{year}</option>)}
          </select>
          <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} className="bg-white border-1 border-black px-6 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase">
            {['winter', 'spring', 'summer', 'fall'].map(season => <option key={season} value={season}>{season}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-3 grid-rows-[200px_200px_200px_200px] lg:grid-rows-[270px_270px_270px_270px] gap-2 lg:h-[150vh] md:h-[800px] h-[105vh]">
          {[
            { anime: seasonalAnime[3], span: "col-span-3" },
            { anime: seasonalAnime[1], span: "row-span-2" },
            { anime: seasonalAnime[7], span: "" },
            { anime: seasonalAnime[5], span: "" },
            { anime: seasonalAnime[2], span: "col-span-2" },
            { anime: seasonalAnime[9], span: "col-span-2" },
            { anime: seasonalAnime[8], span: "" },
          ].map((item, index) => (
            <Link to={item.anime ? `/anime/${item.anime.mal_id}` : "#"} key={index} className={`${item.span} relative overflow-hidden group cursor-pointer block`}>
              <img  src={item.anime?.images?.jpg?.large_image_url} alt="Anime" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:opacity-85" />
              <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity">
                <p className="font-['Kanit'] text-white text-[0.7rem] sm:text-xs md:text-lg font-bold uppercase truncate w-full">{item.anime?.title_english}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="explore-section" className="w-full py-16 px-6 md:px-16 bg-gray-50 ">
        <h1 className="font-['Kanit'] text-2xl lg:text-4xl font-black text-center mb-12 uppercase tracking-wider border-b-2 border-black pb-2">Explore and Discover New Animes</h1>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16">
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full focus:outline-none lg:max-w-xl bg-white border-1 border-black rounded-full px-6 py-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {['All', 'Award Winning', 'Action', 'Comedy', 'Drama', 'Fantasy'].map((f) => (
              <button key={f} onClick={() => setActiveGenre(f)} className={` px-6 py-2 border-2 border-black font-black rounded-[4px] uppercase text-xs ${activeGenre === f ? 'bg-black text-white' : ''}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
          {filteredAnime.map((anime, idx) => (
            <Link to={`/anime/${anime.mal_id}`} key={`${anime.mal_id}-${idx}`} className="flex flex-col group">
              <div className="relative aspect-[2/3] border-1 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-1 transition-all duration-700">
                <img loading="lazy" src={anime.images.jpg.image_url} alt={anime.title_english} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-[10px] font-bold">★ {anime.score || 'N/A'}</div>
              </div>
              <h2 className="mt-6 font-['Kanit'] text-[1.25rem] truncate">{anime.title_english || anime.title}</h2>
            </Link>
          ))}
        </div>
        <div className="mt-16 flex justify-center">
          <button onClick={handleLoadMore} className="bg-black text-white px-6 py-3 rounded-lg text-[1rem] lg:text-lg font-black uppercase shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:bg-white hover:text-black active:bg-black active:opacity-75 border-2 border-black transition-all duration-600">Load More Results</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;