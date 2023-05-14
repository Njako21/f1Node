//This component calculates the cumulative points for a user-selected driver and displays them in a line chart
import React, { useEffect, useState } from 'react';
import LineChart from './LineChart';

const PointsCalculator = () => {
    const [pointsSystems, setPointsSystems] = useState({});
    const [driverPoints, setDriverPoints] = useState({});
    const [driverName, setDriverName] = useState('');

    //Calls the backend for pointssystems, formats the data for later use and stores it.
    useEffect(() => {
        const fetchPointsSystems = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/f1/all/pointsSystems');
                const data = await response.json();
                const pointsSystemsData = data.Content.Content;

                const convertedPointsSystems = {};

                Object.entries(pointsSystemsData).forEach(([yearsString, pointsData]) => {
                    const years = yearsString.split(',').map(year => {
                        if (!isNaN(year)) {
                            return parseInt(year);
                        } else {
                            const rangeYears = year.split('-').map(y => parseInt(y));
                            const range = [];
                            for (let i = rangeYears[0]; i <= rangeYears[1]; i++) {
                                range.push(i);
                            }
                            return range;
                        }
                    });

                    const convertedPointsData = {};

                    Object.entries(pointsData).forEach(([position, points]) => {
                        convertedPointsData[parseInt(position)] = parseInt(points);
                    });

                    years.flat().forEach(year => {
                        convertedPointsSystems[year] = convertedPointsData;
                    });
                });

                setPointsSystems(convertedPointsSystems);
            } catch (error) {
                console.error('Error fetching points systems:', error);
            }
        };

        fetchPointsSystems();
    }, []);

    //Calls the backend for race results that the user-selected driver has competed in.
    const calculateDriverPoints = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/f1/driver/${driverName}`);
            const data = await response.json();
            const races = data.Content.Content;

            const driverPointsPerYear = {};

            races.forEach(race => {
                const raceYear = parseInt(race.year);
                const positionOrder = parseInt(race.positionOrder);

                let pointsSystem = {};

                // Find the corresponding points system for the race year.
                Object.entries(pointsSystems).forEach(([year, system]) => {
                    if (year <= raceYear && positionOrder in system) {
                        pointsSystem = system;
                    }
                });

                if (Object.keys(pointsSystem).length > 0) {
                    const points = pointsSystem[positionOrder];

                    // Store the points for each season the driver has competed in.
                    if (driverPointsPerYear[raceYear]) {
                        driverPointsPerYear[raceYear] += points;
                    } else {
                        driverPointsPerYear[raceYear] = points;
                    }
                }
            });

            // Calculate cumulative points per season.
            const cumulativePoints = {};
            let totalPoints = 0;

            Object.keys(driverPointsPerYear).forEach(year => {
                totalPoints += driverPointsPerYear[year];
                cumulativePoints[year] = totalPoints;
            });

            setDriverPoints(cumulativePoints);
        } catch (error) {
            console.error('Error fetching driver data:', error);
        }
    };

    //Handles the input field.
    const handleDriverNameChange = event => {
        setDriverName(event.target.value);
    };

    //Data mapping to chart format.
    const driverPointData = {
        labels: Object.entries(driverPoints).map(([season]) => season),
        datasets: [{
            labels: 'Points',
            data: Object.entries(driverPoints).map(([, points]) => points)
        }]
    }

    return (
        <div>
            <h1>Career point calculator</h1>
            <p>Shows the career points for a driver cumulated.</p>
            <p>Capitalise first letters, replace spaces with underscores.</p>
	    <p>Example: Max_Verstappen</p>

            <input
                type="text"
                placeholder="Enter driver name"
                value={driverName}
                onChange={handleDriverNameChange}
            />
            <button onClick={calculateDriverPoints}>Calculate Points</button>

            <LineChart 
            chartData={driverPointData}
            />
        </div>
    );
};

export default PointsCalculator;
