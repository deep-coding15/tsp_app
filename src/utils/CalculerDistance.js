import React, { useEffect, useState } from "react";
import './CalculerDistance.css';

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
            ({ ville1, ville2 }) =>
                (ville1 === depart && ville2 === arrivee) ||
                (ville1 === arrivee && ville2 === depart)
        );
        if (found) {
            setResult(`${depart} <=> ${arrivee} : ${found.distance_km} km`);
        } 
        else if(depart === "" || arrivee === ""){
            setResult(alert("Veuillez entrer votre ville de depart ou d'arrivee"));
        }
        else if (depart === arrivee) {
            setResult(`${depart} <=> ${arrivee} : 0 km`);
        } else {
            setResult("Distance non trouvée.");
        }
    };

    return (
        <div className="distance-villes">
            <div className="depart item">
                <label>La ville de départ : </label>
                <select value={depart} onChange={(e) => setDepart(e.target.value)}>
                    <option value="">--Sélectionner--</option>
                    {cities.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>
            
           
            <div className="arrivee item">
                <label>La ville d'arrivée : </label>
                <select value={arrivee} onChange={(e) => setArrivee(e.target.value)}>
                    <option value="">--Sélectionner--</option>
                    {cities.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={distanceCalculator}>Rechercher</button>

            {result && <p>{result}</p>}
        </div>
    );
}

//transformer un fichier json en un tableau 2D
function JsonTo2D(){
    const [data, setData] = useState([])
    const [villes, setVilles] = useState([])
    const [cities_with_distances, setCities_with_distances] = useState([])
    const [Tableau2D, setTableau2D] = useState([])
    useEffect(() => {
        fetch("./distances_villes.json")
        .then((res) => res.json())
        .then((json) => {
            setData(json.distances)

            const distances = json.distances;
            
            const cities = json.distances.flatMap(({ville1, ville2}) => [ville1, ville2]);
            const uniqueCities = [...new Set(cities)]

            //associer à chaque ville un index
            const map = new Map();
            uniqueCities.forEach((element, index) => {
                map.set(element, index)
            });

            //cree un tableau 2D de taille le nombre de villes du fichier Json avec valeurs Infinity par defaut 
            var tailleTableau = uniqueCities.length;
            let matrix = Array.from({length: tailleTableau}, () => Array(tailleTableau).fill(Infinity))
   
            //Remplis le tableau avec les valeurs
            //cities_with_distances && cities_with_distances.forEach(({ville1, vi})) 
                
                /* cities_with_distances &&  */distances.forEach(({ville1, ville2, distance_km}) => {
                    const i = map.get(ville1);
                    const j = map.get(ville2);
                       
                    matrix[i][j] = distance_km;
                    matrix[j][i] = distance_km;
                })
            setTableau2D(matrix)
            setVilles([...new Set(cities)])
            
        })
    }, [])
    
    
    return Tableau2D;
}

export {JsonTo2D}

export default CalculerDistance;
