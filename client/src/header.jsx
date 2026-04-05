import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';

const Header = ({ user, onSearchTrigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      onSearchTrigger(localSearch);
      navigate('/');
      setTimeout(() => {
        document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="fixed top-0 w-full flex justify-around items-center px-4 md:px-16 py-3 backdrop-blur-md bg-white/40 z-[100] border-b border-black/5 shadow-lg">
      <Link to="/" className="flex items-center gap-1">
        <img src={logo} alt="icon" className="w-16 h-auto object-cover" />
        <p className="font-['Kanit'] font-black text-xl tracking-wider text-black">AnimeKun</p>
      </Link>

      <div className="hidden lg:block relative">
        <input 
          type="text" 
          placeholder="Search anime..." 
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={handleSearchSubmit}
          className="bg-white/50 border border-black/90 rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black w-72 transition-all focus:w-64"
        />
      </div>

      <nav className="hidden md:flex items-center">
        <ul className="flex items-center list-none">
          <li><Link to="/" className="ml-8 px-2 font-semibold text-sm uppercase tracking-widest text-black border-b-2 border-black hover:border-transparent active:border-transparent transition-all duration-700 rounded-sm">Home</Link></li>
          {user && <li><Link to="/dashboard" className="ml-8 px-2 font-semibold text-sm uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 rounded-sm">Dashboard</Link></li>}
          <li><a href="#vote" className="ml-8 px-2 font-semibold text-sm uppercase tracking-widest text-black border-b-2 border-black hover:border-transparent active:border-transparent transition-all duration-700 rounded-sm">Vote</a></li>
          <li><a href="#community" className="ml-8 px-2 font-semibold text-sm uppercase tracking-widest text-black border-b-2 border-black hover:border-transparent active:border-transparent transition-all duration-700 rounded-sm">Community</a></li>
        </ul>
      </nav>

      <div className="hidden md:flex items-center gap-4 ml-4">
        {user ? (
          <img src={user.avatar} alt="profile" className="w-10 h-10 rounded-full border-2 border-black object-cover" />
        ) : (
          <>
            <Link to="/login" className="bg-black text-white px-4 py-1.5 rounded-md text-xs font-bold uppercase hover:opacity-60 transition-opacity duration-400">Login</Link>
            <Link to="/signup" className="bg-black text-white px-4 py-1.5 rounded-md text-xs font-bold uppercase hover:opacity-60 transition-opacity duration-400">Sign Up</Link>
          </>
        )}
      </div>

      <button className="md:hidden text-black text-2xl focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 w-3/5 bg-white flex flex-col items-center py-8 gap-6 shadow-xl md:hidden animate-fade-in">
          <input type="text" placeholder="Search..." className="bg-gray-100 border rounded-full px-6 py-2 w-4/5" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} onKeyDown={handleSearchSubmit} />
          <Link to="/" className="font-bold uppercase border-b-2 border-black rounded px-17 hover:bg-grey-200">Home</Link>
          {user && <Link to="/dashboard" className="font-bold uppercase border-b-2 border-blue-600 text-blue-600 rounded px-17">Dashboard</Link>}
          <div className="flex flex-col w-4/5 gap-3">
            {!user && (
              <>
                <Link to="/login" className="bg-black text-white py-3 rounded-md font-bold text-center uppercase">Login</Link>
                <Link to="/signup" className="bg-black text-white py-3 rounded-md font-bold text-center uppercase">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;