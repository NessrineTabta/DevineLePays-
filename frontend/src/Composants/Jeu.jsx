import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Jeu = () => {
  const [imageId, setImageId] = useState(null);
  const [imageCountry, setImageCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [result, setResult] = useState(null);
  const accessToken = "MLY|9508916365807424|c0a1ab299e693a5c0d232d1d43318f9d";

  // Liste des pays pour la génération aléatoire
  const countries = [
    { name: "France", bbox: "2.3522,48.8566,2.3622,48.8666" }, // Paris
    { name: "USA", bbox: "-74.0060,40.7128,-73.9450,40.7328" }, // New York City
    { name: "Japan", bbox: "139.6917,35.6895,139.7017,35.6995" }, // Tokyo
    { name: "India", bbox: "77.2090,28.6139,77.2190,28.6239" }, // New Delhi
    { name: "Brazil", bbox: "-46.6333,-23.5505,-46.6233,-23.5405" }, // São Paulo
  ];

  const randomCountry = countries[Math.floor(Math.random() * countries.length)];

  useEffect(() => {
    // Utilisation de la route rapide avec bbox pour un pays aléatoire
    const apiUrl = `https://graph.mapillary.com/images?access_token=${accessToken}&fields=id&bbox=${randomCountry.bbox}&limit=1`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setImageId(data.data[0].id);
          setImageCountry(randomCountry.name); // Pays aléatoire sélectionné
        }
      })
      .catch((error) => console.error("Erreur de chargement :", error));
  }, []);

  useEffect(() => {
    // Initialisation rapide de la carte OpenStreetMap
    const map = L.map("map").setView([20, 0], 3);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Clic sur la carte pour choisir un pays
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then((res) => res.json())
        .then((geoData) => {
          if (geoData.address && geoData.address.country) {
            setSelectedCountry(geoData.address.country);
          }
        });
    });

    return () => map.remove();
  }, []);

  const checkAnswer = () => {
    if (selectedCountry) {
      if (selectedCountry === imageCountry) {
        setResult("✅ Bravo ! C'est le bon pays !");
      } else {
        setResult(`❌ Mauvaise réponse. C'était : ${imageCountry}`);
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "0px" }}>
      <h2>Jeu Interactif FIND A COUNTRY 🚀</h2>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        {/* Carte à gauche */}
        <div style={{ width: "50%", paddingRight: "20px" }}>
          <div id="map" style={{ width: "100%", height: "500px" }}></div>
        </div>

        {/* Mapillary à droite */}
        <div style={{ width: "50%" }}>
          {/* Image 360° Mapillary */}
          {imageId ? (
            <iframe
              src={`https://www.mapillary.com/embed?image_key=${imageId}&style=photo`}
              width="800"
              height="500"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <p>Chargement de l'image...</p>
          )}
        </div>
      </div>

      {/* Affichage du pays sélectionné */}
      {selectedCountry && <p>🌍 Pays sélectionné : {selectedCountry}</p>}

      {/* Vérification de la réponse */}
      <button
  onClick={checkAnswer}
  style={{
    marginTop: "0px",
    padding: "5px",
    fontSize: "16px",
    width: "auto", // Empêche le bouton de prendre toute la largeur
    maxWidth: "200px", // Vous pouvez ajuster cette valeur selon votre besoin
    marginLeft: "auto", // Centre le bouton horizontalement
    marginRight: "auto", // Centre le bouton horizontalement
    display: "block", // Pour le centrage avec margin auto
  }}
>
  Vérifier
</button>


      {/* Résultat */}
      {result && <h3>{result}</h3>}
    </div>
  );
};

export default Jeu;
