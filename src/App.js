import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import UserPage from "./components/UserPage";
import "./styles/App.css";

function decodeJWT(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

function App() {
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserName = localStorage.getItem("userName");
    const savedUserId = localStorage.getItem("userId");

    if (savedToken && savedUserName && savedUserId) {
      const decodedToken = decodeJWT(savedToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
      } else {
        setToken(savedToken);
        setUserName(savedUserName);
        setUserId(savedUserId);
      }
    }
  }, []);

  const handleLogin = (newToken, newUserName, newUserId) => {
    setToken(newToken);
    setUserName(newUserName);
    setUserId(newUserId);
    localStorage.setItem("token", newToken);
    localStorage.setItem("userName", newUserName);
    localStorage.setItem("userId", newUserId);
  };

  const handleLogout = () => {
    setToken("");
    setUserName("");
    setUserId("");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
  };

  return (
    <Router>
      <div className="App">
        <h1>Users To Do Tasks</h1>
        <Routes>
          <Route
            path="/"
            element={!token ? <Home /> : <Navigate to="/user" />}
          />
          <Route
            path="/register"
            element={!token ? <Register /> : <Navigate to="/user" />}
          />
          <Route
            path="/login"
            element={
              !token ? (
                <Login setToken={handleLogin} />
              ) : (
                <Navigate to="/user" />
              )
            }
          />
          <Route
            path="/user"
            element={
              token ? (
                <UserPage
                  handleLogout={handleLogout}
                  userName={userName}
                  userId={userId}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
