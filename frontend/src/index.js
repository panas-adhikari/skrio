import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AppProvider } from "./context/AppContext";
import Home from "./pages/home";
import Login from "./pages/login";
import { checkUserExists } from "./context/apiManager";

function AppContent() {
  const [loggedIn , setLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  };

  return loggedIn ? (
    <Home setLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={() => setLoggedIn(true)} />
  );
}
function MainApp() {
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        const userExistence = checkUserExists();
        if (!userExistence) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.setItem("isLoggedIn", "false");
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
