import "./App.css";
import { Button, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Map from "./components/Map";
import NewTicketField from "./components/Ticket Layout/NewTicketField";
import TicketsList from "./components/Ticket Layout/TicketsList";
import { useEffect } from "react";
import { setCustomerData } from "./store/store-actions/customerDataActions";

/*
  Files with api endpoints
  useOptimalRoute
  DisplayRoute
  mpaOptionsActions
  customerDataActions
*/
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    //store customer data in redux
    dispatch(setCustomerData());
  }, [dispatch]);

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-around h-100 px-0 py-5">
      <div className="d-flex flex-column mb-4" style={{ height: "10%" }}>
        <NewTicketField />
      </div>

      <div
        className="d-flex flex-column flex-lg-row w-100 align-self-center d-flex flex-row px-5 my-4 justify-content-between"
        style={{ height: "90%" }}>
        <TicketsList />
        <Map />
      </div>
      <div className="align-self-center">
        <Button
          onClick={() => {
            navigate("/route");
          }}
          className="mx-2">
          Get optimal route
        </Button>
        {/* <Button
          onClick={() => {
            navigate("/select-tickets");
          }}
          className="mx-2">
          Select Tickets
        </Button> */}
      </div>
    </Container>
  );
}

export default App;
