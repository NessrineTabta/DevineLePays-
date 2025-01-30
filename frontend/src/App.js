import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { auth } from './Backend/Firebase'; // Update with correct path

import Authentification from './Composants/Authentification'; // Ensure this is the correct path
import Jeu from './Composants/Jeu';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

const Navbar = () => {
  const { currentUser } = useAuth(); // Consume currentUser from context

  const handleLogout = () => {
    auth.signOut(); // Sign out the user when they click "Se Déconnecter"
  };

  return (
    <nav className="navbar-menu">
      <ul className="navbar-start">
        <li><Link className="navbar-item" to="/">Accueil</Link></li>
        {!currentUser ? (
          <li><Link className="navbar-item" to="/auth">Se connecter / S'inscrire</Link></li>
        ) : (
          <li>
            <button className="navbar-item" onClick={handleLogout}>Se déconnecter</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/" />; // Redirect to home if user is logged in
  }

  return children;
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
