import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UserPage from "./components/UserPage";

function App() {
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserName = localStorage.getItem("userName");
    if (savedToken && savedUserName) {
      setToken(savedToken);
      setUserName(savedUserName);
    }
  }, []);

  const handleLogin = (newToken, newUserName) => {
    setToken(newToken);
    setUserName(newUserName);
    localStorage.setItem("token", newToken);
    localStorage.setItem("userName", newUserName);
  };

  const handleLogout = () => {
    setToken("");
    setUserName("");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  };

  return (
    <Router>
      <div className="App">
        <h1>My React App</h1>
        <Routes>
          <Route
            path="/"
            element={
              !token ? (
                <>
                  <Register />
                  <Login setToken={handleLogin} />
                </>
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
                  token={token}
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
