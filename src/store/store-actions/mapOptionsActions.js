import { updateRouteCoordinates } from "../store-slice/mapOptionsSlice";
import { MAP_BOX_KEY } from "../../constants";

export const setRouteCoordinates = (geocodesToVisit) => {
  return async (dispatch) => {
    console.log(geocodesToVisit);
    if (geocodesToVisit.length === 1) {
      //if no destinations to visit for the technician selected
      dispatch(
        updateRouteCoordinates({
          newCoordinates: null,
        })
      );
      return;
    }
    //searching and setting  the route coordinated based on the geocodesToVisit
    let searchCoordinates = "";
    for (const geocode of geocodesToVisit)
      searchCoordinates += `${geocode[1]},${geocode[0]};`;
    searchCoordinates = searchCoordinates.substring(
      0,
      searchCoordinates.length - 1
    );
    console.log(searchCoordinates);
    const result = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${searchCoordinates}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${MAP_BOX_KEY}`
    );

    const data = await result.json();
    console.log(data);
    dispatch(
      updateRouteCoordinates({
        newCoordinates: data.routes[0].geometry.coordinates,
      })
    );
  };
};
