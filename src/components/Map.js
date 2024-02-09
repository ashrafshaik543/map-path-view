import React, { useRef, useEffect } from "react";
import mapboxgl from "!mapbox-gl"; /* eslint import/no-webpack-loader-syntax: off */
import { useDispatch, useSelector } from "react-redux";
import { updateBounds } from "../store/mapDataSlice";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg";

const Map = () => {
  const mapData = useSelector((state) => state.mapData);
  const mapContainerRef = useRef(null);
  const dispatch = useDispatch();

  // Initialize map when component mounts
  useEffect(() => {
    let map = [];
    if (mapData.addresses.length === 0) {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-99.6649, 38.6013],
        // maxBounds: bounds,
        zoom: mapData.zoom,
      });

      new mapboxgl.Marker().setLngLat([-99.6649, 38.6013]).addTo(map);
    } else if (mapData.addresses.length === 1) {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [
          mapData.addresses[0].geocode[1],
          mapData.addresses[0].geocode[0],
        ],
        // maxBounds: bounds,
        zoom: mapData.zoom,
      });

      new mapboxgl.Marker()
        .setLngLat([
          mapData.addresses[0].geocode[1],
          mapData.addresses[0].geocode[0],
        ])
        .addTo(map);
    } else {
      let minLat = mapData.addresses[0].geocode[0];
      let maxLat = mapData.addresses[0].geocode[0];
      let minLong = mapData.addresses[0].geocode[1];
      let maxLong = mapData.addresses[0].geocode[1];
      for (const location of mapData.addresses) {
        minLat = Math.min(minLat, location.geocode[0]);
        maxLat = Math.max(maxLat, location.geocode[0]);
        minLong = Math.min(minLong, location.geocode[1]);
        maxLong = Math.max(maxLong, location.geocode[1]);
      }
      console.log([mapData.center[1], mapData.center[0]]);
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [mapData.center[1], mapData.center[0]],
        zoom: 5,
      });
      mapData.addresses.map((location) =>
        new mapboxgl.Marker()
          .setLngLat([location.geocode[1], location.geocode[0]])
          .addTo(map)
      );
      dispatch(
        updateBounds({
          bounds: [
            [minLong - 0.5, minLat - 0.5],
            [maxLong + 0.5, maxLat + 0.5],
          ],
        })
      );
      // console.log([minLong - 0.1, minLat - 0.1], [maxLong + 0.1, maxLat + 0.1]);
      map.fitBounds([
        [minLong - 0.5, minLat - 0.5],
        [maxLong + 0.5, maxLat + 0.5],
      ]);
    }

    // Create default markers
    // geoJson.features.map((feature) =>
    //   new mapboxgl.Marker().setLngLat(feature.geometry.coordinates).addTo(map)
    // );

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => map.remove();
  }, [mapData.addresses, mapData.zoom, mapData.center, dispatch]);

  return (
    <div className="my-5 w-75 align-self-center">
      <div ref={mapContainerRef} style={{ height: "500px", width: "100%" }} />
    </div>
  );
};

export default Map;
