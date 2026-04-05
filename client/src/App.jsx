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

const App = () => {
  const [user, setUser] = useState(null);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleGlobalSearch = (term) => {
    setGlobalSearchTerm(term);
  };

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
              <Route path="/anime/:id" element={<AnimeDetail />} />
              <Route path="/dashboard" element={<Dashboard user={user} />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;