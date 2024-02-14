import "./App.css";
import { Button, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Map from "./components/Map";
import NewTicketField from "./components/Ticket Layout/NewTicketField";
import TicketsList from "./components/Ticket Layout/TicketsList";
import customers from "./customers.json";
import { useCallback, useEffect } from "react";
import { setCustomerData } from "./store/customerDataActions";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getGeocode = useCallback(async (address) => {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?proximity=ip&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg`
    );
    const data = await res.json();
    let geocode = [
      data.features[0].geometry.coordinates[1],
      data.features[0].geometry.coordinates[0],
    ];
    return geocode;
  }, []);

  useEffect(() => {
    let customerNames = [...customers.names];
    let customerAddresses = [...customers.addresses];

    dispatch(setCustomerData(customerNames, customerAddresses));
  }, [dispatch, getGeocode]);

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-around h-100 px-0 py-5">
      <div className="d-flex flex-column mb-4" style={{ height: "10%" }}>
        <NewTicketField />
      </div>

      <div
        className="d-flex flex-row w-100 align-self-center d-flex flex-row px-5 my-4 justify-content-between"
        style={{ height: "90%" }}>
        <TicketsList />
        <Map />
      </div>
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
