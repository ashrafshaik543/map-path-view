import { useCallback, useEffect, useState } from "react";
import { MAP_BOX_KEY } from "../../constants";

const useOptimalRoute = (
  technician,
  technicianToVisitGeocodes,
  destinationDetails
) => {
  //destination or customer geocode locations to visit for the technician
  const [geocodesToVisit, setGeocodesToVisit] = useState([
    technicianToVisitGeocodes[0],
  ]);
  const [geocodesToVisitDetails, setGeocodesToVisitDetails] = useState([]);
  console.log(destinationDetails);
  const getGraph = useCallback(async () => {
    if (technicianToVisitGeocodes.length === 1 || !technicianToVisitGeocodes) {
      //if only technician location geocode present return empty array of geocodes to visit
      setGeocodesToVisit([technicianToVisitGeocodes[0]]);
      setGeocodesToVisitDetails([]);
      return;
    }
    //adjecency matrix of distances of all the customer geocodes
    let tempGraph = [];
    for (let i = 0; i < technicianToVisitGeocodes.length; i++)
      tempGraph.push(new Array(technicianToVisitGeocodes.length).fill(0));

    for (let i = 0; i < technicianToVisitGeocodes.length; i++) {
      for (let j = 0; j < technicianToVisitGeocodes.length; j++) {
        if (i !== j) {
          const res = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${technicianToVisitGeocodes[i][1]},${technicianToVisitGeocodes[i][0]};${technicianToVisitGeocodes[j][1]},${technicianToVisitGeocodes[j][0]}?access_token=${MAP_BOX_KEY}`
          );
          const data = await res.json();
          tempGraph[i][j] = data.routes[0].distance;
        }
      }
    }
    //did technician visit the geocode
    let v = new Array(technicianToVisitGeocodes.length).fill(false);
    v[0] = true;
    let shortestDistance = Infinity;
    let shortestPath = [];
    let shortestPathDestinationDetails = [];
    //algo for Travelling Salesman Problem
    const TSP = (v, currPos, n, count, cost, path, ticketDetails) => {
      if (count === n && tempGraph[currPos][0] !== 0) {
        if (shortestDistance > cost + tempGraph[currPos][0]) {
          shortestPath = path;
          shortestPathDestinationDetails = ticketDetails;
        }

        shortestDistance = Math.min(
          shortestDistance,
          cost + tempGraph[currPos][0]
        );
        return;
      }
      for (let i = 0; i < n; i++) {
        if (!v[i] && tempGraph[currPos][i]) {
          v[i] = true;
          TSP(
            v,
            i,
            n,
            count + 1,
            cost + tempGraph[currPos][i],
            [...path, technicianToVisitGeocodes[i]],
            [...ticketDetails, destinationDetails[i - 1]]
          );
          v[i] = false;
        }
      }
    };
    TSP(
      v,
      0,
      technicianToVisitGeocodes.length,
      1,
      0,
      [[technicianToVisitGeocodes[0][0], technicianToVisitGeocodes[0][1]]],
      []
    );
    // console.log(shortestPathDestinationDetails);
    // console.log(tempGraph);
    setGeocodesToVisit(shortestPath);
    setGeocodesToVisitDetails(shortestPathDestinationDetails);
  }, [
    technicianToVisitGeocodes,
    setGeocodesToVisit,
    setGeocodesToVisitDetails,
    destinationDetails,
  ]);

  useEffect(() => {
    getGraph();
  }, [technician]);

  return { geocodesToVisit, geocodesToVisitDetails };
};

export default useOptimalRoute;
