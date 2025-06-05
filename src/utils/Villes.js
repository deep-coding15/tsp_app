import { useEffect, useState } from "react";
import LireJson from "./LireJson"
function Villes({id}){
    const [villes, setVilles] = useState([])

    useEffect(() => {
        fetch("/distances_villes.json")
        .then((response) => response.json())
        .then((json) => {
            const distances = json.distances;

            //recuperer toutes les villes des deux colonnes
            const toutesVilles = distances.flatMap(item => [item.ville1, item.ville2]);

            //Supprimer les doublons
            const villesUniques = Array.from(new Set(toutesVilles));
            setVilles(villesUniques)
        })
        .catch((err) => console.log("Erreur lors du chargement : ", err));
        
    }, []);
    /* const data = <LireJson />
    console.log(data); */
    
    return (
        <>
            
            {/* <h1>Liste des villes</h1> */}
            <select htmlFor={id}>
                <option disabled value="">Sélectionner une option</option>
                {villes.map((ville, index) => (
                <option key={index} value={ville}>{ville}</option>
                ))}
            </select>
        </>
    )
}

export default Villes;