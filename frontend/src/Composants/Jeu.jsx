import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../Css/Jeu.css"; // ✅ Import du CSS amélioré

const Jeu = () => {
  const [imageId, setImageId] = useState(null);
  const [imageCountry, setImageCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [result, setResult] = useState(null);
  const [mapSize, setMapSize] = useState({ width: 250, height: 150 });
  const mapRef = useRef(null);
  const accessToken = "MLY|9508916365807424|c0a1ab299e693a5c0d232d1d43318f9d";

  const countries = [
    { name: "France", bbox: "2.3522,48.8566,2.3622,48.8666" },
    { name: "USA", bbox: "-74.0060,40.7128,-73.9450,40.7328" },
    { name: "Japan", bbox: "139.6917,35.6895,139.7017,35.6995" },
    { name: "India", bbox: "77.2090,28.6139,77.2190,28.6239" },
    { name: "Brazil", bbox: "-46.6333,-23.5505,-46.6233,-23.5405" },
  ];

  const randomCountry = countries[Math.floor(Math.random() * countries.length)];

  useEffect(() => {
    const apiUrl = `https://graph.mapillary.com/images?access_token=${accessToken}&fields=id&bbox=${randomCountry.bbox}&limit=1`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setImageId(data.data[0].id);
          setImageCountry(randomCountry.name);
        }
      })
      .catch((error) => console.error("Erreur de chargement :", error));
  }, [randomCountry.bbox, randomCountry.name]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", { zoomControl: true }).setView([20, 0], 3);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);

      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then((res) => res.json())
          .then((geoData) => {
            if (geoData.address && geoData.address.country) {
              setSelectedCountry(geoData.address.country);
            }
          });
      });
    }
  }, []);

  const checkAnswer = () => {
    if (selectedCountry) {
      setResult(
        selectedCountry === imageCountry
          ? "✅ Bravo ! C'est le bon pays !"
          : `❌ Mauvaise réponse. C'était : ${imageCountry}`
      );
    }
  };

  const increaseMapSize = () => {
    setMapSize((prevSize) => ({
      width: prevSize.width + 50 > 300 ? 300 : prevSize.width + 50,
      height: prevSize.height + 30 > 200 ? 200 : prevSize.height + 30,
    }));
  };

  const decreaseMapSize = () => {
    setMapSize((prevSize) => ({
      width: prevSize.width - 50 < 150 ? 150 : prevSize.width - 50,
      height: prevSize.height - 30 < 100 ? 100 : prevSize.height - 30,
    }));
  };

  return (
    <div className="jeu-container">
      <h2 className="jeu-title">🌍 FIND A COUNTRY 🚀</h2>

      <div className="jeu-video-container">
        {imageId ? (
          <iframe
            title="Vue Mapillary"
            src={`https://www.mapillary.com/embed?image_key=${imageId}&style=photo`}
            className="jeu-video"
            allowFullScreen
          ></iframe>
        ) : (
          <p>Chargement de l'image...</p>
        )}

        {/* ✅ Map bien placée en bas à droite */}
        <div
          className="jeu-map"
          style={{ width: `${mapSize.width}px`, height: `${mapSize.height}px` }}
        >
          <div className="jeu-map-controls">
            <button className="jeu-map-button" onClick={increaseMapSize}>🔍 Zoom</button>
            <button className="jeu-map-button" onClick={decreaseMapSize}>🔎 Dézoom</button>
          </div>
          <div id="map" className="jeu-map-content"></div>
        </div>
      </div>

      {selectedCountry && <p className="jeu-selected-country">📍 Pays sélectionné : {selectedCountry}</p>}

      <button className="jeu-button" onClick={checkAnswer}>Vérifier</button>

      {result && <h3 className="jeu-result">{result}</h3>}
    </div>
  );
};

export default Jeu;
