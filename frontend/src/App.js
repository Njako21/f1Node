import { useState } from 'react';
import ChaosEffect from "./components/ChaosEffect";
import PointsCalculator from "./components/PointsCalculator";


function App() {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option value="">Select an option</option>
        <option value="option1">Driver career point calculator</option>
        <option value="option2">Chaos effect by season</option>
      </select>

      {selectedOption === 'option1' && <PointsCalculator />}
      {selectedOption === 'option2' && <ChaosEffect />}
    </div>
  );
}

export default App;
