import { useEffect, useState } from "react";

function RecupererJson(){
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch("/distances_villes.json")
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((err) => console.log("Erreur lors du chargement : ", err));
    })
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
export default RecupererJson;