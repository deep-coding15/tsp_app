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

function Combine(props){
    const tab = JsonTo2D();
    const cost = [
        [ 0, 50, 15, 20 ], [ 10, 0, 35, 50 ], [ 15, 25, 0, 30 ],
        [ 20, 25, 30, 0 ]
    ];
    const naive = naiveApproach(cost);
    console.log(naive)
    return naive;
}
export {Combine}

//this calculate the distance of all the permutations for every cities and select the minimum
//props : must be an 2dimensions Array
//it's a good approach when the number of cities is under 10.
function naiveApproach(props){

    //Number of nodes
    const numNodes = props.length;
    const nodes = [];

    //initialize the nodes and excluding the point started 0
    for(let i = 1; i < numNodes; i++){
        nodes.push(i)
    }

    let minCost = Infinity;

    //Generate all permutations of the remaining nodes
    const permutations = getPermutations(nodes);
    for (let perm of permutations) {
        let currCost = 0;
        let currNode = 0; //start from node 0
        
        //calculate the cost of the current permutation
        for (let i = 0; i < perm.length; i++) {
            currCost += props[currNode][perm[i]];
            currNode = perm[i];
            
        }

        //Add the cost to return to the starting node
        currCost += props[currNode][0];

        //update the minimum
        minCost = Math.min(minCost, currCost);
        console.log(minCost);
        
    }
    return minCost;
}

//function to generate all permutations of an array
function getPermutations(array){
    const result = []

    if (array.length === 1) {
        return [ array ];
    }

    for (let i = 0; i < array.length; i++) {
        const current = array[i];
        const remaining = array.slice(0, i).concat(array.slice(i+1));

        const remainingPermutations = getPermutations(remaining);

        for(let perm of remainingPermutations)
            result.push([current].concat(perm));
    }

    console.log(result);
    
    return result;
}



//todo : ecrire la fonction qui permet de trouver le plus court chemin

export {JsonTo2D}

export default CalculerDistance;
