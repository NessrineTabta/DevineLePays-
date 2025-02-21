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
    <nav className="navbar-menu" style={{ padding: '10px', backgroundColor: '#333' }}>
      <ul className="navbar-start" style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
        <li><Link className="navbar-item" to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Accueil</Link></li>
        {!currentUser ? (
          <li><Link className="navbar-item" to="/auth" style={{ color: 'white', textDecoration: 'none' }}>Se connecter / S'inscrire</Link></li>
        ) : (
          <>
            <li style={{ marginRight: '20px' }}>
              <Link className="navbar-item" to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profil</Link>
            </li>
            <li>
              <button 
                className="navbar-item" 
                onClick={() => auth.signOut()} 
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                Se déconnecter
              </button>
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
