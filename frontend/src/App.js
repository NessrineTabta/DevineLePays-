import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { auth } from "./Backend/Firebase"; // Update with correct path

import Authentification from "./Composants/Authentification"; 
import Jeu from "./Composants/Jeu";
import Profile from "./Composants/Profile"; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

const Navbar = () => {
  const { currentUser } = useAuth();

  return (
    <nav className="navbar-menu">
      <ul className="navbar-start">
        <li><Link className="navbar-item" to="/">Accueil</Link></li>
        {!currentUser ? (
          <li><Link className="navbar-item" to="/auth">Se connecter / S'inscrire</Link></li>
        ) : (
          <>
            <li><Link className="navbar-item" to="/profile">Profil</Link></li>
            <li>
              <button className="navbar-item" onClick={() => auth.signOut()}>Se déconnecter</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

// Route protégée pour les pages accessibles uniquement aux utilisateurs connectés
const ProtectedRouteAuth = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/auth" />;
};

// Route protégée pour empêcher un utilisateur connecté d'aller sur /auth
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  return currentUser ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route 
            path="/auth" 
            element={
              <ProtectedRoute>
                <Authentification />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Jeu />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRouteAuth>
                <Profile />
              </ProtectedRouteAuth>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export { useAuth };
export default App;
