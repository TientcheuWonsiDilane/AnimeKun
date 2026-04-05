import React from 'react';
import logo from './assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#fdfdfd] border-t-2 border-black py-3 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="flex flex-col items-center md:items-start gap-5">
          <div className="flex items-center gap-1">
            <img src={logo} alt="AnimeKun Logo" className="w-28 h-auto object-contain" />
            <span className="font-['Kanit'] text-2xl font-black tracking-wider">
              AnimeKun
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 max-w-xs text-center md:text-left">
            Your ultimate destination for tracking seasonal anime and discovering new favorites.
          </p>
        </div>

        <div className="flex gap-8 text-xs font-black uppercase tracking-widest">
          <a href="#" className="hover:underline decoration-2 underline-offset-4">Privacy</a>
          <a href="#" className="hover:underline decoration-2 underline-offset-4">Terms</a>
          <a href="#" className="hover:underline decoration-2 underline-offset-4">API Info</a>
        </div>

        <div className="text-xs font-bold text-gray-400">
          © {currentYear} AnimeKun.
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <div className="inline-block bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
          Powered by Jikan API
        </div>
      </div>
    </footer>
  );
};

export default Footer;