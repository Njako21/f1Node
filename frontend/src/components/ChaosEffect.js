// This component calculates the average difference between a drivers starting- and finishing position for each race in a user selected season and displays a graf for it.
import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';

const ChaosEffect = () => {
  const [year, setYear] = useState('');
  const [races, setRaces] = useState([]);
  const [raceResults, setRaceResults] = useState({});
  const [seasonAverage, setSeasonAverage] = useState(null);

  //Calculates the season average
  useEffect(() => {
    calculateSeasonAverage();
  }, [raceResults]);

  // Calls the backend for a list of races in a given season
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

  // Calls the backend for the resultlist for a specific race, filters the results to only include drivers who finished the race, and calls the calculate average difference function below.
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

  // Takes a list of drivers and their results from a race and calculates the average difference between their starting position and finishing position.
  const calculateAverageDifference = (driverData) => {
    const totalDifference = driverData.reduce((sum, driver) => {
      const positionDifference = Math.abs(driver.positionOrder - driver.grid);
      return sum + positionDifference;
    }, 0);
    return (totalDifference / driverData.length).toFixed(1);
  };

  // Calls the function to fetch race data etc. for each race in a given season.
  const calculateRaceResults = (raceList) => {
    raceList.forEach((race) => {
      fetchRaceResultsData(race.name);
    });
  };

  // Calculates the season average
  const calculateSeasonAverage = () => {
    const raceResultValues = Object.values(raceResults);
    if (raceResultValues.length > 0) {
      const totalDifference = raceResultValues.reduce((sum, result) => sum + parseFloat(result), 0);
      const averageDifference = (totalDifference / raceResultValues.length).toFixed(1);
      setSeasonAverage(averageDifference);
    }
  };

  // handles event for input field
  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  // handles submit
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRacesData();
  };

  // maps data to the required graph format
  const chaosData = {
    labels: Object.entries(raceResults).map(([raceName]) => raceName),
    datasets: [{
        label: "Chaos",
        data: Object.entries(raceResults).map(([_, averageDifference]) => averageDifference)
    }]
  };

  return (
    <div>
      <h1>Chaos effect!</h1>
      <p>*Chaos: The average difference between starting and finishing position for drivers who finished the race.</p>
      <p>Useful for indicating the amount of action, overtaking and overall chaos in a race.</p>
      <h2>Enter a year:</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" value={year} onChange={handleYearChange} placeholder="Enter year" />
        <button type="submit">Submit</button>
      </form>
      {seasonAverage && <p>Season Average: {seasonAverage}</p>}
      <h2>Races</h2>
      <BarChart 
      chartData={chaosData}
      />
    </div>
  );
};

export default ChaosEffect;