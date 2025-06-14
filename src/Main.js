import { useEffect, useState } from 'react';
import { getCities, getOptimizedRoute } from './utils/API_Axios';

import MapView from './utils/react_leaflet';
import { Popup, Marker, Polyline } from 'react-leaflet';

import './Main.css'
import MyPolyline from './utils/line';

function Main() {
  const [citiesMap, setCitiesMap] = useState([]);
  //lorsque les villes sont selectionnees
  const [selectedCities, setSelectedCities] = useState([]);
  //contient la route optimale entre plusieurs points
  const [route, setRoute] = useState(null);
  const [distanceOptimises, setDistanceOptimises] = useState(0);
  const [positionCities, setpositionCities] = useState([[]]);


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

      /* res && res.route.forEach(element => {
        //setpositionCities([element.latitude, element.longitude]);
        console.log("position: ", element.latitude, element.longitude);
      });  */

      /* res && res.route && res.route.forEach((elt) => {
        //setpositionCities([...positionCities, [elt.latitude, elt.longitude]]);
        console.log("position_39: ", [elt.latitude, elt.longitude]);
        setpositionCities([...positionCities, [elt.latitude, elt.longitude]])
      });  */
    
      togglePositonsCity(res.route);
      //console.log("position cities: ", positionCities);
      console.log("passe");
    } catch (err) {
      console.error("Erreur lors de l'optimisation :", err);
    }
  };

  function togglePositonsCity(city) {
    setpositionCities(prev => {
      const found = prev.some(
        c => c[0] === city.latitude && c[1] === city.longitude
      );

      if (found) {
        // Supprimer la position si elle est déjà présente
        return prev.filter(
          c => !(c[0] === city.latitude && c[1] === city.longitude)
        );
      } else {
        // Ajouter la position
        return [...prev, [city.latitude, city.longitude]];
      }
    });
  }
  useEffect(() => {
    console.log("positions cities: ", positionCities);
  }, [positionCities]);
    


  //todo: faire une polyligne avec les lignes selectiones
  const toggleCity = (city) => {
    setSelectedCities(prev => 
      prev.includes(city)
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
    //setpositionCities([]);
    //console.log("positions cities: ", positionCities);
  };
/* const positionCities = [
  [ [34.0209, -6.8416], [35.7595, -5.8339] ], // Ligne entre Rabat et Tanger
  [ [35.7595, -5.8339], [31.6295, -7.9811] ]  // Ligne entre Tanger et Marrakech
]; */
  return (
    <div style={{position: 'relative', top: '-40px', width: '90%', margin: 'auto'}}>
      <h1>Optimiseur de voyage</h1>
      <ul style={{display: 'flex', flexWrap: 'wrap', position: 'relative', top: '70px', gap: '20px'}}>
        {citiesMap && Object.entries(citiesMap).map(([nom, city]) => (
          <li key={nom} style={{listStyle: 'none', width: '60px'}}>
            <label >
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

      <div style={{position: 'relative', top: '40px', width: '70%', left: '40%'}}>
        <button onClick={handleOptimize} >Optimiser</button>
      </div>
      <h1>Itinéraire optimisé :</h1>
      {route && (
        <div>
          <h2>Distance optimisée : {route.distanceOptimises} km</h2>
          <ol style={{display: 'flex', flexWrap: 'wrap'}}>
            {route.map((city, index, arr) => (
              (index === (arr.length - 1)) ? 
              <li key={city.id} style={{listStyle: 'none', width: 'fit-content', marginLeft: '10px'}}>
                {city.name} 
              </li>
              :
              <li key={city.id} style={{listStyle: 'none', width: 'fit-content', marginRight: '10px'}}>
                  {city.name}  -&gt;
              </li>
            ))}
          </ol>
        </div>
      )}
      
      {route && <h3>Distance totale : {distanceOptimises} km</h3>}

      <h2>Visible sur la Map</h2>
      <MapView>
        {citiesMap && Object.entries(citiesMap).map(([key, city], index) =>
          selectedCities.includes(city.name) ? (
            <>
              <Marker key={key || index} position={[city.latitude, city.longitude]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
              <MyPolyline selectedCities/>
              {/* <Polyline positions={[[34.0522, -118.2437], [36.7783, -119.4179]]} /> */}
            </>
          ) : null
        )}
      </MapView>
    </div>
  );
}

export default Main;