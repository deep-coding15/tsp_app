import { useState, useEffect } from "react";

function Distance() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/distances_villes.json")
      .then((response) => response.json())
      .then((json) => setData(json.distances));
  }, []);

  return (
    <div>
      <h1>Distances entre villes</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.ville1} → {item.ville2} : {item.distance_km} km
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Distance;