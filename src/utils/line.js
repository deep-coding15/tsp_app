import { useEffect, useState } from 'react';
import { Polyline, Marker, Popup } from 'react-leaflet';
import { getCities } from './API_Axios';

const MyPolyline = () => {
  const [citiesMap, setCitiesMap] = useState({});

  useEffect(() => {
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
  const cityList = Object.values(citiesMap);

  // Filtrer les villes avec latitude/longitude valides
  const validCities = cityList.filter(
    (city) =>
      typeof city.latitude === "number" && typeof city.longitude === "number"
  );

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
};

export default MyPolyline;
