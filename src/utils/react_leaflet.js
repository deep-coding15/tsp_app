// App.js ou MapView.js
import React from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { getCities, getCitiesOffline } from './API_Axios';

// Correction des icônes de Leaflet dans les bundles Webpack/Vite/CRA
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const MapView = ({ children }) => {
  const [cities, setCities] = React.useState([]);

  React.useEffect(() => {
    getCities().then(data => setCities(data));
  }, []);

  return (
    <MapContainer center={[34.0209, -6.8416]} zoom={4} scrollWheelZoom={false} style={{ height: '70vh', width: '80%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}

      {/* {cities && Object.entries(cities).map(([nom, city]) => (
        <Marker key={nom} position={[city.latitude, city.longitude]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      ))} */}
    </MapContainer>
  );
};

export default MapView;