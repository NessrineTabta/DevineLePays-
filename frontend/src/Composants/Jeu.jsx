import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Jeu = () => {
  const [imageId, setImageId] = useState(null);
  const [imageCountry, setImageCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [result, setResult] = useState(null);
  const accessToken = "MLY|9508916365807424|c0a1ab299e693a5c0d232d1d43318f9d";

  useEffect(() => {
    // Utilisation de la route rapide avec bbox
    const bbox = "2.3522,48.8566,2.3622,48.8666"; // Paris
    const apiUrl = `https://graph.mapillary.com/images?access_token=${accessToken}&fields=id&bbox=${bbox}&limit=1`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setImageId(data.data[0].id);
          // Pas besoin de coordonnées, on prend directement Paris comme pays
          setImageCountry("France");
        }
      })
      .catch((error) => console.error("Erreur de chargement :", error));
  }, []);

  useEffect(() => {
    // Initialisation rapide de la carte OpenStreetMap
    const map = L.map("map").setView([20, 0], 2);
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
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>GeoGuessr Ultra Rapide 🚀</h2>

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

      <h3>📍 Cliquez sur un pays :</h3>
      <div id="map" style={{ width: "800px", height: "400px", margin: "0 auto" }}></div>

      {/* Affichage du pays sélectionné */}
      {selectedCountry && <p>🌍 Pays sélectionné : {selectedCountry}</p>}

      {/* Vérification de la réponse */}
      <button onClick={checkAnswer} style={{ marginTop: "10px", padding: "10px", fontSize: "16px" }}>
        Vérifier
      </button>

      {/* Résultat */}
      {result && <h3>{result}</h3>}
    </div>
  );
};

export default Jeu;