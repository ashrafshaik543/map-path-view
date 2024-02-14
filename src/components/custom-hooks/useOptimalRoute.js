import { useCallback, useEffect, useState } from "react";

const useOptimalRoute = (technician, technicianGeocodes, currentLocation) => {
  const [geocodesToVisit, setGeocodesToVisit] = useState([]);

  const getGraph = useCallback(async () => {
    if (technicianGeocodes.length === 1 || !technicianGeocodes) {
      setGeocodesToVisit([]);
      return;
    }
    let tempGraph = [];
    for (const geocode of technicianGeocodes)
      tempGraph.push(new Array(technicianGeocodes.length).fill(0));

    for (let i = 0; i < technicianGeocodes.length; i++) {
      for (let j = 0; j < technicianGeocodes.length; j++) {
        if (i !== j) {
          const res = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/cycling/${technicianGeocodes[i][1]},${technicianGeocodes[i][0]};${technicianGeocodes[j][1]},${technicianGeocodes[j][0]}?access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg`
          );
          const data = await res.json();
          tempGraph[i][j] = data.routes[0].distance;
        }
      }
    }

    let v = new Array(technicianGeocodes.length).fill(false);
    v[0] = true;
    let shortestDistance = Infinity;
    let shortestPath = [];
    const TSP = (v, currPos, n, count, cost, path) => {
      if (count === n && tempGraph[currPos][0] !== 0) {
        if (shortestDistance > cost + tempGraph[currPos][0])
          shortestPath = path;
        shortestDistance = Math.min(
          shortestDistance,
          cost + tempGraph[currPos][0]
        );
        return;
      }
      for (let i = 0; i < n; i++) {
        if (!v[i] && tempGraph[currPos][i]) {
          v[i] = true;
          TSP(v, i, n, count + 1, cost + tempGraph[currPos][i], [
            ...path,
            technicianGeocodes[i],
          ]);
          v[i] = false;
        }
      }
    };
    TSP(v, 0, technicianGeocodes.length, 1, 0, [
      [currentLocation[1], currentLocation[0]],
    ]);
    console.log(shortestPath);
    setGeocodesToVisit(shortestPath);
  }, [technicianGeocodes]);

  useEffect(() => {
    getGraph();
  }, [technician]);

  return geocodesToVisit;
};

export default useOptimalRoute;
