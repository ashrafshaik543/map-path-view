import {
  updateLongestDistanceFromCenter,
  addToList,
  removeFromList,
  updateRouteCoordinates,
} from "./mapDataSlice";

export const calculateLongestDistanceDate = (mapData) => {
  return async (dispatch) => {
    let newLongestDistance = -1;
    if (mapData.addresses.length > 1) {
      for (const location of mapData.addresses) {
        let coordinate1 = `${mapData.center[1]},${mapData.center[0]};`;
        let coordinate2 = `${location.geocode[1]},${location.geocode[0]}`;
        let coordinates = coordinate1 + coordinate2;
        const result = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/cycling/${coordinates}?geometries=geojson&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg`
        );
        const data = await result.json();

        newLongestDistance = Math.max(
          newLongestDistance,
          data.routes[0].distance
        );
      }
    } else return;

    dispatch(
      updateLongestDistanceFromCenter({
        newLongestDistance,
      })
    );
  };
};

export const setRouteDirections = (addresses, address, actionType, geocode) => {
  return async (dispatch, getState) => {
    if (actionType === "add") {
      console.log(getState().mapData.addresses.length + 1);
      if (getState().mapData.addresses.length + 1 < 2) return;

      let searchCoordinates = "";
      for (const location of getState().mapData.addresses)
        searchCoordinates += `${location.geocode[1]},${location.geocode[0]};`;
      searchCoordinates += `${geocode[1]},${geocode[0]}`;
      // console.log(searchCoordinates);
      const result = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${searchCoordinates}?alternatives=true&geometries=geojson&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg`
      );
      const data = await result.json();
      dispatch(addToList({ newAddress: address, geocode }));
      dispatch(
        updateRouteCoordinates({
          newCoordinates: data.routes[0].geometry.coordinates,
        })
      );
    } else {
      dispatch(removeFromList({ toRemoveAddress: address }));
      if (getState().mapData.addresses.length - 1 < 2) return;

      let searchCoordinates = "";
      for (const location of getState().mapData.addresses) {
        if (location.address !== address)
          searchCoordinates += `${location.geocode[1]},${location.geocode[0]};`;
      }
      searchCoordinates = searchCoordinates.substring(
        0,
        searchCoordinates.length - 1
      );
      // console.log(searchCoordinates);
      const result = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${searchCoordinates}?alternatives=true&geometries=geojson&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg`
      );
      const data = await result.json();
      dispatch(
        updateRouteCoordinates({
          newCoordinates: data.routes[0].geometry.coordinates,
        })
      );
    }
  };
};
