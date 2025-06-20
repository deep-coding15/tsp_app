import API_BASE_URL from "./config";
import axios from "axios";
import {useState, useEffect} from 'react';

//Quand le backend est actif
export async function getCities(){
    try{
        const response = await axios.get(`${API_BASE_URL}/cities`)
        .then((res) => res.data);
        console.log(response);
        
        return response;
    }
    catch(err){
        console.log(err);
    }
} 

/* export async function getCitiesOffline() {
  try {
    const response = await fetch('/villes_maroc.json');
    const data = await response.json();
    return data; // ou juste return data si pas de clé "distances"
  } catch (error) {
    console.error('Erreur de chargement :', error);
    return [];
  }
} */


const headers =   { 'Content-Type': 'application/json' };
/**cette fonction retourne la liste des routes optimisées avec distance*/
/* export async function getOptimizedRoute(cities) {
    return await axios.post(`${API_BASE_URL}/optimize-trip`, JSON.stringify({cities}),  { headers })
                          .then((res) => {console.log(res.data);})
                          .catch((err) => {console.log(err);});
    
} */


export const getOptimizedRoute = async (selectedCities) => {
  try {
    const response = await axios.post("http://localhost:8081/api/optimize-trip", {
      cities: selectedCities
    });

    // axios stocke la vraie réponse dans `response.data`
    return response.data;
  } catch (error) {
    console.error("Erreur dans getOptimizedRoute :", error);
    return null;
  }
};


/* async function getUser() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
} */