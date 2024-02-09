import React, { useCallback, useState } from "react";
import { Map, Marker } from "pigeon-maps";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  upadateCenter,
  updateLongestDistanceFromCenter,
} from "../store/mapDataSlice";
import { calculateLongestDistanceDate } from "../store/mapDataActions";

export function MyMap() {
  const mapData = useSelector((state) => state.mapData);
  const [hue, setHue] = useState(0);
  // const center = useSelector((state) => state.mapData.center);
  const dispatch = useDispatch();
  const [zoom, setZoom] = useState(4);
  const color = `hsl(${hue % 360}deg 39% 70%)`;

  const toRad = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const getLongestDistance = useCallback(async () => {
    dispatch(calculateLongestDistanceDate(mapData));
  }, [dispatch, mapData]);

  useEffect(() => {
    if (mapData.addresses.length === 1 || mapData.addresses.length === 0)
      dispatch(updateLongestDistanceFromCenter({ newLongestDistance: 0 }));

    if (mapData.addresses.length === 1)
      dispatch(upadateCenter({ newCenter: mapData.addresses[0].geocode }));
    else if (mapData.addresses.length > 1) {
      let x = 0;
      let y = 0;
      let z = 0;
      for (const location of mapData.addresses) {
        let latitude = (location.geocode[0] * Math.PI) / 180;
        let longitude = (location.geocode[1] * Math.PI) / 180;

        x += Math.cos(latitude) * Math.cos(longitude);
        y += Math.cos(latitude) * Math.sin(longitude);
        z += Math.sin(latitude);
      }

      let total = mapData.addresses.length;

      x = x / total;
      y = y / total;
      z = z / total;

      let centralLongitude = Math.atan2(y, x);
      let centralSquareRoot = Math.sqrt(x * x + y * y);
      let centralLatitude = Math.atan2(z, centralSquareRoot);
      dispatch(
        upadateCenter({
          newCenter: [
            (centralLatitude * 180) / Math.PI,
            (centralLongitude * 180) / Math.PI,
          ],
        })
      );
    }
  }, [mapData.addresses, dispatch]);

  useEffect(() => {}, []);

  useEffect(() => {
    getLongestDistance();
  }, [mapData.center, getLongestDistance]);

  useEffect(() => {
    console.log(mapData.longestDistanceFromCenter, "longest distance");
  }, [mapData.longestDistanceFromCenter]);

  return (
    <div className="w-75" style={{ height: "500px" }}>
      <Map
        // height={100}
        center={mapData.center}
        zoom={zoom}
        onBoundsChanged={({ center, zoom }) => {
          dispatch(upadateCenter({ newCenter: mapData.center }));
          setZoom(zoom);
        }}>
        {mapData.addresses.length > 0 &&
          mapData.addresses.map((addressData, i) => {
            return (
              <Marker
                key={i}
                onMouseOver={() => {}}
                width={50}
                anchor={addressData.geocode}
                color={color}
                onClick={() => setHue(hue + 20)}
              />
            );
          })}
      </Map>
    </div>
  );
}
