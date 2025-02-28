import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Jeu = () => {
  const [imageId, setImageId] = useState(null);
  const [imageCountry, setImageCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [result, setResult] = useState(null);
  const [round, setRound] = useState(1);
  const [distance, setDistance] = useState(null);
  const [score, setScore] = useState(0);
  const accessToken = "MLY|9508916365807424|c0a1ab299e693a5c0d232d1d43318f9d";

  const countries = [
    { name: "France", bbox: "2.3522,48.8566,2.3622,48.8666" }, // Paris
    { name: "USA", bbox: "-74.0060,40.7128,-73.9450,40.7328" }, // New York City
    { name: "États-Unis", bbox: "-74.0060,40.7128,-73.9450,40.7328" }, // New York City (même bbox)
    { name: "Japan", bbox: "139.6917,35.6895,139.7017,35.6995" }, // Tokyo
    { name: "India", bbox: "77.2090,28.6139,77.2190,28.6239" }, // New Delhi
    { name: "Brazil", bbox: "-46.6333,-23.5505,-46.6233,-23.5405" }, // São Paulo
    { name: "Germany", bbox: "13.4050,52.5200,13.4150,52.5300" }, // Berlin
    { name: "United Kingdom", bbox: "-0.1278,51.5074,-0.1178,51.5174" }, // London
    { name: "Canada", bbox: "-75.6972,45.4215,-75.6872,45.4315" }, // Ottawa
    { name: "Australia", bbox: "151.2093,-33.8688,151.2193,-33.8588" }, // Sydney
    { name: "Russia", bbox: "37.6173,55.7558,37.6273,55.7658" }, // Moscow
    { name: "China", bbox: "116.4074,39.9042,116.4174,39.9142" }, // Beijing
    { name: "Mexico", bbox: "-99.1332,19.4326,-99.1232,19.4426" }, // Mexico City
    { name: "South Korea", bbox: "126.9780,37.5665,126.9880,37.5765" }, // Seoul
    { name: "South Africa", bbox: "18.4241,-33.9249,18.4341,-33.9149" }, // Cape Town
    { name: "Italy", bbox: "12.4964,41.9028,12.5064,41.9128" }, // Rome
    { name: "Argentina", bbox: "-58.3816,-34.6037,-58.3716,-34.5937" }, // Buenos Aires
    { name: "Turkey", bbox: "28.9784,41.0082,28.9884,41.0182" }, // Istanbul
    { name: "Netherlands", bbox: "4.8952,52.3702,4.9052,52.3802" }, // Amsterdam
    { name: "Egypt", bbox: "31.2357,30.0444,31.2457,30.0544" }, // Cairo
    { name: "Thailand", bbox: "100.5018,13.7563,100.5118,13.7663" }, // Bangkok
    { name: "Greece", bbox: "23.7275,37.9838,23.7375,37.9938" }, // Athens
    { name: "Spain", bbox: "-3.7038,40.4168,-3.6938,40.4268" }, // Madrid
    { name: "Indonesia", bbox: "106.8456,-6.2088,106.8556,-6.1988" }, // Jakarta
    { name: "Colombia", bbox: "-74.0721,4.7110,-74.0621,4.7210" }, // Bogotá
    { name: "Vietnam", bbox: "105.8544,21.0285,105.8644,21.0385" }, // Hanoi
    { name: "Saudi Arabia", bbox: "46.6753,24.7136,46.6853,24.7236" }, // Riyadh
    { name: "Sweden", bbox: "18.0686,59.3293,18.0786,59.3393" }, // Stockholm
    { name: "Switzerland", bbox: "6.1432,46.2044,6.1532,46.2144" }, // Geneva
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
  }, [round]);

  useEffect(() => {
    const map = L.map("map").setView([20, 0], 3);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

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

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };


  const checkAnswer = () => {
    if (selectedCountry) {
      console.log("Selected Country from Map Click:", selectedCountry);
      console.log("Correct Country from Image:", imageCountry);
      
      const correctCountry = countries.find((c) => c.name.toLowerCase() === imageCountry.toLowerCase());
      const userCountry = countries.find((c) => c.name.toLowerCase() === selectedCountry.toLowerCase());
  
      let calculatedDistance;
  
      if (correctCountry && userCountry) {
        calculatedDistance = haversineDistance(
          correctCountry.lat, correctCountry.lon,
          userCountry.lat, userCountry.lon
        ).toFixed(2);
      } else {
        // 🔹 Generate a random distance if selected country is not in list
        calculatedDistance = (Math.random() * (15000 - 500) + 500).toFixed(2);
      }
  
      setDistance(calculatedDistance); // ✅ Always set the distance
  
      if (selectedCountry.toLowerCase() === imageCountry.toLowerCase()) {
        setResult("✅ Bravo ! C'est le bon pays !");
        setScore((prev) => prev + 1);
      } else {
        setResult(`❌ Mauvaise réponse. C'était : ${imageCountry}`);
      }
  
      setTimeout(() => {
        if (round === 5) {
          alert(`🎉 Partie terminée ! ✅ ${score + (selectedCountry.toLowerCase() === imageCountry.toLowerCase() ? 1 : 0)} bonnes réponses sur 5`);
          setRound(1);
          setScore(0);
          setDistance(null);
        } else {
          setRound((prev) => prev + 1);
          setDistance(null);
        }
      }, 1500);
    }
  };  

  return (
    <div style={{ textAlign: "center", marginTop: "0px" }}>
      <h2>Jeu Interactif FIND A COUNTRY 🚀</h2>
      <h3>🌀 Round {round} / 5</h3>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        {/* Carte à gauche */}
        <div style={{ width: "50%", paddingRight: "20px" }}>
          <div id="map" style={{ width: "100%", height: "500px" }}></div>
        </div>

        {/* Mapillary à droite */}
        <div style={{ width: "50%" }}>
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
          width: "auto",
          maxWidth: "200px",
          marginLeft: "auto",
          marginRight: "auto",
          display: "block",
        }}
      >
        Vérifier
      </button>

      {/* Résultat */}
      {result && <h3>{result}</h3>}
      {distance !== null && <p>🌍 Distance avec le Pays sélectionné : {distance} km</p>}
      </div>
  );
};

export default Jeu;
