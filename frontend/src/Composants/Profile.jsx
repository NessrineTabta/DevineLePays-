import React, { useEffect, useState } from "react";
import { auth, db } from "../Backend/Firebase"; // Ensure correct path
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import "./../Css/Profile.css"; // Importing the CSS file

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState(""); // BIO properly saved & retrieved
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [prenom, setPrenom] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      setUser(currentUser);

      try {
        // Fetch user data from Firestore (Utilisateurs collection)
        const userDoc = await getDoc(doc(db, "Utilisateurs", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Set all fields exactly as they exist in Firestore
          setName(userData.name ?? "");
          setBio(userData.bio ?? ""); // Bio is fetched correctly
          setPhone(userData.phone ?? "");
          setAddress(userData.address ?? "");
          setPrenom(userData.prenom ?? "");
        } else {
          console.warn("No user data found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // Fetch data when component loads

  const handleUpdate = async () => {
    if (!user) return;

    try {
      // Update Firestore in Utilisateurs collection
      await setDoc(
        doc(db, "Utilisateurs", user.uid),
        { name, bio, phone, address, prenom },
        { merge: true }
      );

      // Update Firebase Authentication profile (only name is updated in Auth)
      await updateProfile(user, { displayName: name });

      alert("Profile updated successfully!");
      setIsEditing(false); // Exit edit mode after updating

      // Fetch updated data from Firestore to instantly reflect changes
      const updatedDoc = await getDoc(doc(db, "Utilisateurs", user.uid));
      if (updatedDoc.exists()) {
        const updatedData = updatedDoc.data();
        setBio(updatedData.bio ?? ""); // Ensure new bio is set
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-bg"></div> {/* Animated Background */}
      <div className="profile-content">
        <h2 className="profile-title">Your Cyber Identity</h2>
        {user ? (
          <>
            <p className="profile-email"><strong>Email:</strong> {user.email}</p>

            {/* Editable Fields (Initially Disabled) */}
            <div className="profile-input-group">
              <label className="profile-label">Name:</label>
              <input
                type="text"
                className="profile-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="profile-input-group">
              <label className="profile-label">Bio:</label>
              <textarea
                className="profile-textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="profile-input-group">
              <label className="profile-label">Phone:</label>
              <input
                type="text"
                className="profile-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="profile-input-group">
              <label className="profile-label">Address:</label>
              <input
                type="text"
                className="profile-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="profile-input-group">
              <label className="profile-label">Prenom:</label>
              <input
                type="text"
                className="profile-input"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            {/* Buttons */}
            {isEditing ? (
              <button onClick={handleUpdate} className="profile-button">
                Update Identity
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="profile-button">
                Modify
              </button>
            )}
          </>
        ) : (
          <p className="profile-message">Access Denied: Please Log In</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
