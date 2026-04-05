import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from './assets/logo.png';
import img from './assets/img1.jpg'; 

const AuthPage = ({ mode, onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', { idToken: response.credential });
      localStorage.setItem('token', res.data.token);
      onLoginSuccess(res.data.user);
      if (!res.data.user.isProfileComplete) navigate('/setup');
      else navigate('/');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex h-screen w-full font-['Poppins']">
      <div className="w-full lg:w-[30%] h-full bg-white flex flex-col justify-center items-center p-10 relative">
        <Link to="/" className="absolute top-8 left-8 font-black uppercase border-b-2 border-black">← Home</Link>
        <img src={logo} className="w-24 mb-6" alt="Logo" />
        <div className="w-24 h-24 rounded-full border-4 border-black mb-6 overflow-hidden bg-gray-100 flex items-center justify-center">
          <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" className="w-2/3 opacity-30" alt="placeholder" />
        </div>
        <h2 className="font-['Kanit'] text-3xl font-black mb-8 uppercase text-center">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />
      </div>
      <div className="hidden lg:block lg:w-[70%] h-full border-l-4 border-black">
        <img src={img} className="w-full h-full object-cover" alt="One Piece" />
      </div>
    </div>
  );
};

export default AuthPage;