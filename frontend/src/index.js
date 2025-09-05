import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AppProvider, useAppContext } from "./context/AppContext";
import Home from "./pages/home";
import Login from "./pages/login";

function AppContent() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn === "true") {
        dispatch({ type: "AUTHORIZE" });
      } else {
        dispatch({ type: "UNAUTHORIZE" });
      }
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    dispatch({ type: "UNAUTHORIZE" });
  };

  return state.isAuthenticated ? (
    <Home setLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={() => dispatch({ type: "AUTHORIZE" })} />
  );
}

function MainApp() {
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
