import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';

const ExampleComponent = () => {
  const [year, setYear] = useState('');
  const [races, setRaces] = useState([]);
  const [raceResults, setRaceResults] = useState({});
  const [seasonAverage, setSeasonAverage] = useState(null);

  useEffect(() => {
    calculateSeasonAverage();
  }, [raceResults]);

  const fetchRacesData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/f1/year/${year}/races`);
      const data = await response.json();
      const raceList = data.Content.Content;
      setRaces(raceList);
      calculateRaceResults(raceList);
    } catch (error) {
      console.error('Error fetching races:', error);
    }
  };

  const fetchRaceResultsData = async (raceName) => {
    try {
      const formattedRaceName = raceName.replace(/ /g, '_');
      const response = await fetch(`http://localhost:3001/api/f1/year/${year}/grand_prix/${formattedRaceName}`);
      const data = await response.json();
      const driverData = data.Content.Content;
      const finishedDrivers = driverData.filter((driver) => driver.status === 'Finished');
      const averageDifference = calculateAverageDifference(finishedDrivers);
      setRaceResults((prevResults) => ({
        ...prevResults,
        [raceName]: averageDifference,
      }));
    } catch (error) {
      console.error('Error fetching race results:', error);
    }
  };

  const calculateAverageDifference = (driverData) => {
    const totalDifference = driverData.reduce((sum, driver) => {
      const positionDifference = Math.abs(driver.positionOrder - driver.grid);
      return sum + positionDifference;
    }, 0);
    return (totalDifference / driverData.length).toFixed(1);
  };

  const calculateRaceResults = (raceList) => {
    raceList.forEach((race) => {
      fetchRaceResultsData(race.name);
    });
  };

  const calculateSeasonAverage = () => {
    const raceResultValues = Object.values(raceResults);
    if (raceResultValues.length > 0) {
      const totalDifference = raceResultValues.reduce((sum, result) => sum + parseFloat(result), 0);
      const averageDifference = (totalDifference / raceResultValues.length).toFixed(1);
      setSeasonAverage(averageDifference);
    }
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRacesData();
  };

  const chaosData = {
    labels: Object.entries(raceResults).map(([raceName]) => raceName),
    datasets: [{
        label: "Chaos",
        data: Object.entries(raceResults).map(([_, averageDifference]) => averageDifference)
    }]
  };

  return (
    <div>
      <h1>Races</h1>
      <form onSubmit={handleSubmit}>
        <input type="number" value={year} onChange={handleYearChange} placeholder="Enter year" />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {races.map((race) => (
          <li key={race.name}>
            {race.name}: {raceResults[race.name] ? raceResults[race.name] : 'Calculating...'}
          </li>
        ))}
      </ul>
      {seasonAverage && <p>Season Average: {seasonAverage}</p>}
      <BarChart 
      chartData={chaosData}
      />
    </div>
  );
};

export default ExampleComponent;