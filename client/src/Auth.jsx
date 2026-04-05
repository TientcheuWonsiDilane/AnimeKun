import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from './assets/logo1.png';
import img from './assets/img1.jpg'; 

const AuthPage = ({ mode, onLoginSuccess }) => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/google', { 
          access_token: tokenResponse.access_token 
        });
        localStorage.setItem('token', res.data.token);
        onLoginSuccess(res.data.user);
        
        if (!res.data.user.isProfileComplete) navigate('/setup');
        else navigate('/');
      } catch (err) { 
        console.error("Login Error:", err); 
      }
    },
    onError: () => console.log('Login Failed'),
  });

  return (
    <div className="flex h-screen w-full font-['Poppins']">
      <div className="w-full lg:w-[25%] h-full bg-white flex flex-col justify-center items-center p-5 relative shadow-[4px_0px_8px_8px_rgba(0,0,0,1)]">
        <Link to="/" className="absolute top-8 left-8 uppercase border-b-2 border-black rounded-sm hover:border-transparent transition-all duration-700 px-2">← Home</Link>
        
        <img src={logo} className="w-128 mb-3" alt="Logo" />
        
        <div className="w-15 h-15 rounded-full border-1 border-black mb-6 overflow-hidden bg-gray-100 flex items-center justify-center">
          <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" className="w-full opacity-70" alt="placeholder" />
        </div>

        <h2 className="text-2xl mb-8 text-center leading-tight tracking-wider">
          {mode === 'login' ? (
            <>Login to your account <br/> <span className="text-lg opacity-50">Welcome back!</span></>
          ) : (
            <>Create your account <br/> <span className="text-xs font-bold opacity-50">Join us today</span></>
          )}
        </h2>

        <button 
          onClick={() => login()}
          className="flex items-center gap-3 border-2 border-grey-500 rounded-lg px-12 py-2 bg-white text-grey-300 active:border-transparent transition-all duration-700 "
        >
          <img 
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" 
            alt="G" 
            className="w-10 h-10" 
          />
          {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
        </button>
      </div>

      <div className="hidden lg:block lg:w-[75%] h-full">
        <img src={img} className="w-full h-full object-cover opacity-90" alt="One Piece" />
      </div>
    </div>
  );
};

export default AuthPage;