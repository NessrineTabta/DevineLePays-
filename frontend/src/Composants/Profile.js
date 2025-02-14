import React, { useEffect, useState } from "react";
import { auth, db } from "../Backend/Firebase"; // Update path if needed
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || "");
          setBio(userData.bio || "");
        }
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    if (!user) return;

    try {
      // Update Firestore
      await setDoc(doc(db, "users", user.uid), { name, bio }, { merge: true });

      // Update Firebase Authentication profile
      await updateProfile(user, { displayName: name });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Profile</h2>
      {user ? (
        <>
          <p><strong>Email:</strong> {user.email}</p>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: "block", marginBottom: "10px" }}
          />
          <label>Bio:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ display: "block", marginBottom: "10px" }}
          />
          <button onClick={handleUpdate} style={{ padding: "10px", cursor: "pointer" }}>
            Update Profile
          </button>
        </>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default Profile;
