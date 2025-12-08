import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Profile from './pages/Profile/Profile';
import Notifications from './pages/Notifications/Notifications';
import Messages from './pages/Messages/Messages';
import React from 'react';
import Terms from './pages/Terms/Terms';

const routes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/profile', element: <Profile /> },
  { path: '/notifications', element: <Notifications /> },
  { path: '/messages', element: <Messages /> },
  { path: '/terms', element: <Terms /> },
];

export default routes;
