import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './header.jsx';
import Footer from './footer.jsx';
import AnimeDetail from './details.jsx';
import HomePage from './HomePage.jsx';
import AuthPage from './Auth.jsx';
import ProfileSetup from './profileSet.jsx';
import Dashboard from './dashboard.jsx';
import Community from './Community.jsx';
import PostDetails from './PostDetails.jsx';
import Voting from './voting.jsx';
import VoteDetails from './voteDetails.jsx';



const App = () => {
  const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.get('https://animekun-production.up.railway.app/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data);
    })
    .catch(() => {
      localStorage.removeItem('token');
    })
    .finally(() => {
      setLoading(false); 
    });
  } else {
    setLoading(false);
  }
}, []);

if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={<AuthPage mode="signup" onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/setup" element={<ProfileSetup user={user} onComplete={setUser} />} />

        <Route path="*" element={
          <>
            <Header user={user} onSearchTrigger={handleGlobalSearch} />
            <Routes>
              <Route path="/" element={<HomePage searchTermFromHeader={globalSearchTerm} />} />
              <Route path="/community" element={<Community user={user} />} />
              <Route path="/post/:id" element={<PostDetails currentUser={user} />} />
              <Route path="/anime/:id" element={<AnimeDetail user={user} setUser={setUser} />} />
              <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
             <Route path="/voting" element={<Voting />} />
             <Route path="/vote/:categoryId" element={<VoteDetails currentUser={user} />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;