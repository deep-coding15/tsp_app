import { useEffect, useState } from "react";

function Villes(){
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

    return (
        <div>
            {/* <h1>Liste des villes</h1> */}
            <select>
                <option disabled value="">Sélectionner une option</option>
                {villes.map((ville, index) => (
                <option key={index} value={ville}>{ville}</option>
                ))}
            </select>
        </div>
    )
}

export default Villes;