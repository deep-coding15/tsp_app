import { useEffect, useState } from 'react';
import { getCities } from './utils/API_Axios';

export function SelectedCities(){
    //lorsque les villes sont selectionnees
    const [selectedCities, setSelectedCities] = useState([]);
  
    const toggleCity = (city) => {
        setSelectedCities(prev => 
        prev.includes(city)
            ? prev.filter(c => c !== city)
            : [...prev, city]
        );
        //setpositionCities([]);
        //console.log("positions cities: ", positionCities);
    };

    return toggleCity;
}


