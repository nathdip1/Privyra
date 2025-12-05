// src/routes.js

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Profile from './pages/Profile/Profile';
import Notifications from './pages/Notifications/Notifications';
import Messages from './pages/Messages/Messages';
import React from 'react';
import Terms from './pages/Terms/Terms';

// Temporary placeholder for Search page
const Search = () => <h1>Search Page</h1>;

const routes = [
  { path: '/', element: <Home /> },           // Homepage
  { path: '/home', element: <Home /> },       // Alias for homepage
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/profile', element: <Profile /> },
  { path: '/notifications', element: <Notifications /> },
  { path: '/messages', element: <Messages /> },
  { path: '/search', element: <Search /> }, 
  { path: '/terms', element: <Terms /> },  // Search placeholder
];

export default routes;

