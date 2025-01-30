import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../Backend/firebaseFunctions';
import { auth, googleProvider, facebookProvider, db } from '../Backend/Firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import '../Css/Authentification.css'; // Importation du fichier CSS

const Authentification = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await registerUser(email, password, name, prenom, phone, address);
      } else {
        await loginUser(email, password);
      }
      navigate('/'); // Redirect to home after login/register
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('User logged in: ', user);
      await handleUserDoc(user);
      navigate('/'); // Redirect to home
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      console.log('User logged in: ', user);
      await handleUserDoc(user);
      navigate('/'); // Redirect to home
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUserDoc = async (user) => {
    const userDoc = await getDoc(doc(db, "Utilisateurs", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "Utilisateurs", user.uid), {
        email: user.email,
        name: user.displayName,
        prenom: "",
        phone: "",
        address: "",
        id: String(user.uid).padStart(3, '0'),
      });
    }
  };

  return (
    <div className="container">
      <h4>{isRegistering ? 'S\'inscrire' : 'Se connecter'}</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label>Mot de passe</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isRegistering && (
          <>
            <div className="mb-2">
              <label>Nom</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label>Prénom</label>
              <input
                type="text"
                className="form-control"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label>Téléphone</label>
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label>Adresse</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <button
          type="submit"
          className="btn btn-primary"
        >
          {isRegistering ? 'S\'inscrire' : 'Se connecter'}
        </button>

        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Déjà inscrit ? Se connecter' : 'Pas encore inscrit ? S\'inscrire'}
        </button>
      </form>
      <div className="social-login-buttons">
        <button
          className="btn btn-danger"
          onClick={handleGoogleLogin}
        >
          Se connecter avec Google
        </button>
        <button
          className="btn btn-primary"
          onClick={handleFacebookLogin}
        >
          Se connecter avec Facebook
        </button>
      </div>
    </div>
  );
};

export default Authentification;
