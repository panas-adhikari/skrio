import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AppProvider } from './context/AppContext';
import Home from './pages/home';
import Login from './pages/login';
import { useState } from 'react';

function MainApp() {
  const [isLoggedIn, setIsLogged] = useState(
    !!localStorage.getItem("token") // stay logged in if token exists
  );

  const handleLogout = () => {
    localStorage.removeItem("token");  // remove JWT
    localStorage.removeItem("user");   // remove user info
    setIsLogged(false);                // reset state
  };

  return (
    <AppProvider>
      {isLoggedIn ? (
        <Home setLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={() => setIsLogged(true)} />
      )}
    </AppProvider>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
