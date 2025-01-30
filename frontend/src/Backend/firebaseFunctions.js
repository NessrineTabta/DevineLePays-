import { auth, db } from './Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const registerUser = async (email, password, name, prenom, phone, address) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "Utilisateurs", user.uid), {
      email,
      name,
      prenom,
      phone,
      address,
      id: String(user.uid).padStart(3, '0'),
    });

    console.log('Utilisateur enregistré : ', user.uid);
  } catch (error) {
    console.error("Erreur lors de l'inscription : ", error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "Utilisateurs", user.uid));
    if (userDoc.exists()) {
      const token = await user.getIdToken();
      console.log('Connexion réussie ! Token : ', token);
      return token;
    } else {
      throw new Error("Utilisateur non trouvé");
    }
  } catch (error) {
    console.error("Erreur lors de la connexion : ", error);
    throw error; // Pour propager l'erreur
  }
};
