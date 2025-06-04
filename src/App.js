import logo from './logo.svg';
import Distance from './utils/VillesDistance';
import Villes from './utils/Villes';
import RecupererJson from './utils/LireJson';
function App() {
  return (
    <>
      <label>La ville de depart</label>
      <Villes />

      <label>La ville d'arrivée</label>
      <Villes />
      <RecupererJson/>

    </>
    
  );
}


export default App;
