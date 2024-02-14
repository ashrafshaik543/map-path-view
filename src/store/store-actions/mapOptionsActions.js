import { updateRouteCoordinates } from "../store-slice/mapOptionsSlice";

export const setRouteCoordinates = (geocodesToVisit) => {
  return async (dispatch) => {
    if (geocodesToVisit.length === 0) {
      dispatch(
        updateRouteCoordinates({
          newCoordinates: null,
        })
      );
      return;
    }
    let searchCoordinates = "";
    for (const geocode of geocodesToVisit)
      searchCoordinates += `${geocode[1]},${geocode[0]};`;
    searchCoordinates = searchCoordinates.substring(
      0,
      searchCoordinates.length - 1
    );
    const result = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${searchCoordinates}?alternatives=true&geometries=geojson&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg`
    );
    const data = await result.json();
    dispatch(
      updateRouteCoordinates({
        newCoordinates: data.routes[0].geometry.coordinates,
      })
    );
  };
};
