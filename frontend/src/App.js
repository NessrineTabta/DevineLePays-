import React from 'react';
import Jeu from './Composants/Jeu'; // Importer le composant Jeu

import './Css/App.css'; // Assurez-vous que les styles sont bien appliqués

function App() {
  return (
    <div className="App">


      {/* Remplacer le contenu actuel par le composant Jeu */}
      <Jeu />
    </div>
  );
}

export default App;
