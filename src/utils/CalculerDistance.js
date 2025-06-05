import React, { useEffect, useState } from "react";

function CalculerDistance() {
  const [data, setData] = useState([]);
  const [cities, setCities] = useState([]);
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [result, setResult] = useState(null);
    //code pour lancer le chargement du fichier qui contient les distances entre deux villes en JSON
  useEffect(() => {
    fetch("/distances_villes.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json.distances);

        // Extraire toutes les villes sans doublons
        const allCities = json.distances.flatMap((d) => [d.ville1, d.ville2]);
        //Les trois points servent à convertir le Set en tableau, pour pouvoir l’utiliser facilement dans React 
        setCities([...new Set(allCities)]);
      });
  }, []);

  const distanceCalculator = () => {
    const found = data.find(
      ({ville1, ville2}) =>
        (ville1 === depart && ville2 === arrivee) ||
        (ville1 === arrivee && ville2 === depart)
    );
    if (found) {
      setResult(`${depart} <=> ${arrivee} : ${found.distance_km} km`);
    } else {
      setResult("Distance non trouvée.");
    }
  };

  return (
    <div>
      <label>
        La ville de départ
        <select value={depart} onChange={(e) => setDepart(e.target.value)}>
          <option value="">--Sélectionner--</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <label>
        La ville d'arrivée
        <select value={arrivee} onChange={(e) => setArrivee(e.target.value)}>
          <option value="">--Sélectionner--</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <button onClick={distanceCalculator}>Calculer</button>

      {result && <p>{result}</p>}
    </div>
  );
}

export default CalculerDistance;
