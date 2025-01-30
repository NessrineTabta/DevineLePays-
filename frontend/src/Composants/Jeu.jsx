import React, { useEffect, useState } from "react";

const Jeu = () => {
  const [imageId, setImageId] = useState(null);
  const accessToken = "MLY|9508916365807424|c0a1ab299e693a5c0d232d1d43318f9d";

  useEffect(() => {
    // Zone spécifique pour limiter la requête (ex: Paris)
    const bbox = "2.3522,48.8566,2.3622,48.8666"; // Paris, France (petit cadre pour filtrer rapidement)

    // API optimisée avec un bounding box et limit=1
    const apiUrl = `https://graph.mapillary.com/images?access_token=${accessToken}&fields=id&bbox=${bbox}&limit=1`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setImageId(data.data[0].id); // Sélectionner directement l'unique image
        }
      })
      .catch((error) => console.error("Erreur lors du chargement des images :", error));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Explorer un endroit spécifique en 360°</h2>
      {imageId ? (
        <iframe
          src={`https://www.mapillary.com/embed?image_key=${imageId}&style=photo`}
          width="800"
          height="500"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default Jeu;
