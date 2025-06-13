import { useEffect, useState } from 'react';
import { getCities, getOptimizedRoute } from './utils/API_Axios';

function Main() {
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const axiosCities = async () => {
      try {
        setLoading(true);
        const data = await getCities();
        //console.log("cities: ", data);
        setCities(data);
      } catch (err) {
        setError('Échec du chargement des villes');
      } finally {
        setLoading(false);
      }
    };
    axiosCities();
  }, []);

  const handleOptimize = async () => {
    if (selectedCities.length < 2) {
      setError('Veuillez sélectionner au moins 2 villes');
      return;
    }
    
    try {
      setLoading(true);
      const result = await getOptimizedRoute(selectedCities);
      setOptimizedRoute(result.route || []);
      setError(null);
    } catch (err) {
      setError('Échec de l\'optimisation de l\'itinéraire');
    } finally {
      setLoading(false);
    }
  };

  /**cette fonction permet d'ajouter ou retirer dynamiquement une ville parmi celle cochee par l'utilisateur */
  const toggleCity = (city) => {
    setSelectedCities(prev =>
      prev.includes(city)
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  const calculateTotalDistance = () => {
    if (optimizedRoute.length < 2) return 0;
    
    let total = 0;
    for (let i = 0; i < optimizedRoute.length - 1; i++) {
      const from = optimizedRoute[i];
      const to = optimizedRoute[i + 1];
      total += calculateDistance(from, to);
    }
    return total.toFixed(2);
  };

  const calculateDistance = (a, b) => {
    // Distance euclidienne simplifiée (pourrait être améliorée avec la formule haversine)
    const dx = a.latitude - b.latitude;
    const dy = a.longitude - b.longitude;
    return Math.sqrt(dx * dx + dy * dy) * 111; // Approximation en km (1° ≈ 111km)
  };

  if (loading && cities.length === 0) return <div>Chargement...</div>;

  
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{position: 'relative', top: '-10px'}}>Optimiseur de voyage au Maroc</h1>
      
      <h2 style={{position: 'relative', top: '-30px'}}>Villes disponibles :</h2>
      <div style={{ marginBottom: '20px', marginTop: '-50px' }}>
        {cities && cities.map((city) => (
          
          <div key={city} style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={selectedCities.includes(city)}
                onChange={() => toggleCity(city)}
                style={{ marginRight: '8px' }}
              />
              {city}
            </label>
          </div>
        ))}
      </div>

      <button 
        onClick={handleOptimize}
        disabled={selectedCities.length < 2 || loading}
        style={{
          padding: '10px 15px',
          backgroundColor: selectedCities.length < 2 ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: selectedCities.length >= 2 ? 'pointer' : 'not-allowed'
        }}
      >
        {loading ? 'Optimisation en cours...' : 'Optimiser l\'itinéraire'}
      </button>

      {optimizedRoute.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2>Itinéraire optimisé :</h2>
          <ol>
            {optimizedRoute.map((city, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                {index === 0 ? 'Départ : ' : `→ Étape ${index} : `}
                <strong>{city.name}</strong>
                {index < optimizedRoute.length - 1 && (
                  <span style={{ color: '#666', fontSize: '0.9em', marginLeft: '10px' }}>
                    (Distance jusqu'à {optimizedRoute[index + 1].name}: {calculateDistance(city, optimizedRoute[index + 1]).toFixed(2)} km)
                  </span>
                )}
              </li>
            ))}
          </ol>
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <strong>Distance totale :</strong> {calculateTotalDistance()} km
            <br />
            <strong>Nombre d'étapes :</strong> {optimizedRoute.length}
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;