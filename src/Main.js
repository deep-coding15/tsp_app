import { useEffect, useState } from 'react';
import { getCities, getOptimizedRoute } from './utils/API_Axios';

import MapView from './utils/react_leaflet';
import { Popup, Marker } from 'react-leaflet';

function Main() {
  const [citiesMap, setCitiesMap] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [route, setRoute] = useState(null);
  const [distanceOptimises, setDistanceOptimises] = useState(0);

  useEffect(() => {
    getCities().then(data => setCitiesMap(data));
  }, []);

  const handleOptimize = async () => {
    try {
      console.log(selectedCities);
      
      const res = await getOptimizedRoute(selectedCities);
      console.log(res);
      res && console.log(res.route);
      res && console.log(res.distanceOptimises);
      setRoute(res.route);
      setDistanceOptimises(res.distanceOptimises);
    } catch (err) {
      console.error("Erreur lors de l'optimisation :", err);
    }
  };


  
  const toggleCity = (city) => {
    setSelectedCities(prev =>
      prev.includes(city)
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  return (
    <div>
      <h1>Optimiseur de voyage</h1>
      <ul>
        {citiesMap && Object.entries(citiesMap).map(([nom, city]) => (
          <li key={nom}>
            <label>
              <input
                type="checkbox"
                checked={selectedCities.includes(nom)}
                value={nom}
                onChange={e => {
                  const id = e.target.value;
                  toggleCity(id);
                }}
              />
              {city.name}
            </label>
          </li>
        ))}
      </ul>

      <button onClick={handleOptimize}>Optimiser</button>

      <h2>Itinéraire optimisé :</h2>
      {route && (
        <div>
          <h2>Distance optimisée : {route.distanceOptimises} km</h2>
          <ol>
            {route.map((city, index) => (
              <li key={city.id} style={{listStyle: 'none'}}>
                {city.name} 
              </li>
            ))}
          </ol>
        </div>
      )}
      
      {route && <h3>Distance totale : {distanceOptimises} km</h3>}

      <h2>Visible sur la Map</h2>
      <MapView>
        {citiesMap && Object.entries(citiesMap).map(([nom, city]) =>
          selectedCities.includes(city.name) ? (
            <Marker key={nom} position={[city.latitude, city.longitude]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          ) : null
        )}
      </MapView>
    </div>
  );
}

export default Main;