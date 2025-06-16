import { useEffect, useState } from 'react';
import { Polyline, Marker, Popup } from 'react-leaflet';
import { getCities, getCitiesOffline } from './API_Axios';
import PropTypes from 'prop-types';

export const MyPolyline = ({positions}) => {
  if(!Array.isArray(positions) || positions.length === 0) return null;
  
  return (
    <>
      {positions.map((line, index) => (
        <Polyline positions={line}
              pathOptions={{color: 'blue', weight: 4}}
        />
      ))}
    </>
    
  );
};

MyPolyline.propTypes = {
  lines: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.number) // chaque ligne = tableau de [lat, lng]
    )
  ).isRequired,
};

export function buildPolylineFromCityNamesArray(allCities, cityNames) {
  // Étape 1 : Filtrer les villes selon le nom dans l'ordre donné
  const selectedCities = cityNames
    .map(name => allCities.find(city => city.name === name))
    .filter(Boolean); // enlève les valeurs nulles si une ville n’est pas trouvée

  // Étape 2 : Créer les paires de positions successives
  const result = [];
  for (let i = 0; i < selectedCities.length - 1; i++) {
    const cityA = selectedCities[i];
    const cityB = selectedCities[i + 1];

    result.push([
      [cityA.latitude, cityA.longitude],
      [cityB.latitude, cityB.longitude]
    ]);
  }

  return result;
}

export function buildPolylineFromCityNamesObject(citiesObject, cityNames) {
  const selectedCities = cityNames
    .map(name => citiesObject[name])
    .filter(Boolean); // ignore undefined si nom pas trouvé

  const result = [];

  for (let i = 0; i < selectedCities.length - 1; i++) {
    const cityA = selectedCities[i];
    const cityB = selectedCities[i + 1];

    result.push([
      [cityA.latitude, cityA.longitude],
      [cityB.latitude, cityB.longitude]
    ]);
  }

  return result;
}



export default MyPolyline;



/* 
 /* useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getCities();
        setCitiesMap(data); // objet avec les noms de ville comme clés
      } catch (error) {
        console.error("Erreur lors du chargement des villes :", error);
      }
    };
    fetchCities();
  }, []); 

  // Transformation de l'objet en tableau
  //const cityList = Object.values(children);
  console.log("cities map: ", citiesMap);//object
  // Compute cityList from citiesMap state
  const cityList = Object.entries(citiesMap);

  console.log("cities map: ", citiesMap);//object
  console.log("cities list: ", cityList); //array

  // Filtrer les villes avec latitude/longitude valides
  const validCities = cityList
    .filter(
      (city) =>
        typeof city.at(1)?.latitude === "number" &&
        typeof city.at(1)?.longitude === "number"
    )
    .map((city) => city[1]);

  console.log(validCities);

  const polylinePositions = validCities.map((city) => [
    city.latitude,
    city.longitude,
  ]);

  return (
    <>
      {validCities.map((city, index) => (
        <Marker key={city.id || index} position={[city.latitude, city.longitude]}>
          <Popup>{city.name}</Popup>
        </Marker>
      ))}

      {polylinePositions.length >= 2 && (
        <Polyline positions={polylinePositions} color="blue" />
      )}
    </>
  );
*/