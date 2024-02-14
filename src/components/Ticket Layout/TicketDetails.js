import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setRouteDirections } from "../../store/ticketActions";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
// import Dropdown from "react-bootstrap/Dropdown";
import {
  assignTechnician,
  changeTicketCheckStatus,
  unassignTechnician,
} from "../../store/ticketDataSlice";

const TicketDetails = ({ index, ticket }) => {
  const ticketData = useSelector((state) => state.ticketData);
  const dispatch = useDispatch();
  return (
    <ListGroup.Item className="d-flex flex-row justify-content-between">
      <div className="d-flex flex-column d-inline mb-0 justify-content-between">
        <div>
          <p className="mb-1">
            <b>{ticket.jobDescription}</b>
          </p>
        </div>
        <Form.Check // prettier-ignore
          defaultChecked={ticketData.tickets[index].selected}
          onChange={(e) => {
            console.log(e.target.checked);
            dispatch(
              changeTicketCheckStatus({ index, status: e.target.checked })
            );
            if (!e.target.checked) dispatch(unassignTechnician({ index }));
          }}
          type={"checkbox"}
          id={`default-checkbox${index}`}
          label={`Assign Technician`}
        />
      </div>
      <div className="d-flex flex-column d-inline mb-0 justify-content-between">
        <Button
          className="align-self-end mb-2"
          onClick={() => {
            dispatch(
              setRouteDirections(
                ticketData,
                ticketData.tickets[index],
                "remove",
                index
              )
            );
          }}
          variant="light">
          &#10060;
        </Button>
        {ticketData.tickets[index].selected && (
          // <Dropdown>
          //   <Dropdown.Toggle variant="success" id="dropdown-basic">
          //     Select Technician
          //   </Dropdown.Toggle>

          //   <Dropdown.Menu>
          //     <Dropdown.Item href="#/action-1">Tech A</Dropdown.Item>
          //     <Dropdown.Item href="#/action-2">Tech B</Dropdown.Item>
          //     <Dropdown.Item href="#/action-3">Tech C</Dropdown.Item>
          //   </Dropdown.Menu>
          // </Dropdown>
          <Form.Select
            onChange={(e) => {
              if (e.target.value !== "0") {
                // console.log(e.target.value);
                dispatch(
                  assignTechnician({ technician: e.target.value, index })
                );
              } else {
                dispatch(unassignTechnician({ index }));
              }
            }}
            aria-label="Default select example">
            <option
              selected={!ticketData.tickets[index].technician ? true : false}
              value={"0"}>
              Select Technician
            </option>
            <option
              selected={
                ticketData.tickets[index].technician === "one" ? true : false
              }
              value="one">
              Technician 1
            </option>
            <option
              selected={
                ticketData.tickets[index].technician === "two" ? true : false
              }
              value="two">
              Technician 2
            </option>
            <option
              selected={
                ticketData.tickets[index].technician === "three" ? true : false
              }
              value="three">
              Technician 3
            </option>
          </Form.Select>
        )}
      </div>
    </ListGroup.Item>
  );
};

export default TicketDetails;
