import "./App.css";
import { Button, Container } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
// import Map from "./components/Map";
import AddressList from "./components/AddressList";
// import { MyMap } from "./components/MyMap";
import { useDispatch, useSelector } from "react-redux";
// import { addToList, removeFromList } from "./store/mapDataSlice";
import { useNavigate } from "react-router-dom";
import Map from "./components/Map";
import { setRouteDirections } from "./store/mapDataActions";

function App() {
  const [addressSuggestionList, setAddressSuggestionList] = useState([]);
  const mapData = useSelector((state) => state.mapData);
  const [addressValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const position = [32.944012, -85.953853];
  // const position2 = [51.405, -0.09];

  useEffect(() => {
    if (!inputValue) setAddressSuggestionList([]);
  }, [inputValue]);

  const removeFromAddressList = useCallback(
    (address) => {
      // setRouteDirections(mapData.addresses, address, "remove");
      dispatch(setRouteDirections(mapData.addresses, address, "remove"));
      // dispatch(removeFromList({ toRemoveAddress: address }));
    },
    [dispatch, mapData.addresses]
  );

  const getGeocode = useCallback(
    async (address) => {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?proximity=ip&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg`
      );
      const data = await res.json();
      let geocode = [
        data.features[0].geometry.coordinates[1],
        data.features[0].geometry.coordinates[0],
      ];
      dispatch(setRouteDirections(mapData.addresses, address, "add", geocode));
      // dispatch(addToList({ newAddress: address, geocode: geocode }));
      // return geocode
    },
    [mapData.addresses, dispatch]
  );

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-around h-100 px-0 py-5">
      <div className="d-flex flex-column mb-4" style={{ height: "10%" }}>
        <Autocomplete
          className="align-self-center h-25"
          value={addressValue}
          id="combo-box-demo"
          inputValue={inputValue}
          onInputChange={async (e, newInputValue) => {
            setInputValue(newInputValue);
            const res = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.target.value}.json?proximity=ip&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg`
            );
            const data = await res.json();
            const possibleAddress = data.features.map((element, i) => {
              return element.place_name;
            });

            setAddressSuggestionList(possibleAddress);
          }}
          onChange={async (e, newValue) => {
            if (newValue) {
              setInputValue("");
              getGeocode(newValue);
            }
          }}
          options={addressSuggestionList}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Search Address" />
          )}
        />
      </div>

      <div
        className="d-flex flex-row w-100 align-self-center d-flex flex-row px-5 my-4"
        style={{ height: "90%" }}>
        <AddressList removeFromAddressList={removeFromAddressList} />
        <Map />
        {/* <MyMap /> */}
      </div>
      {/* <Map /> */}
      <div className="align-self-center">
        <Button
          onClick={() => {
            navigate("/route");
          }}
          className="">
          Get optimal route
        </Button>
      </div>
    </Container>
  );
}

export default App;
