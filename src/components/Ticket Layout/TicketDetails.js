import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setRouteDirections } from "../../store/store-actions/ticketActions";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";

import {
  assignTechnician,
  changeTicketCheckStatus,
  unassignTechnician,
} from "../../store/store-slice/ticketDataSlice";
import {
  assignTicketToTechnician,
  unAssignTechnicianByTicketId,
} from "../../store/store-slice/technicianDataSlice";

const TicketDetails = ({ index, ticket }) => {
  const ticketData = useSelector((state) => state.ticketData);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log(ticketData.tickets[index]);
  //   console.log(index);
  // });
  return (
    <ListGroup.Item className="d-flex flex-row justify-content-between">
      <div className="d-flex flex-column d-inline mb-0 justify-content-between">
        <div>
          <p className="mb-1">
            <b>{ticket.jobDescription}</b>
          </p>
        </div>
        <Form.Check // prettier-ignore
          checked={ticketData.tickets[index].selected}
          onChange={(e) => {
            //checkbox to or not to assign a technician
            console.log(e.target.checked);
            dispatch(
              changeTicketCheckStatus({ index, status: e.target.checked })
            );
            if (!e.target.checked) {
              dispatch(unassignTechnician({ index }));
              dispatch(unAssignTechnicianByTicketId({ ticketId: index }));
            }
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
            //remove ticket data from store
            dispatch(
              setRouteDirections(ticketData.tickets[index], "remove", index)
            );
          }}
          variant="light">
          &#10060;
        </Button>
        {ticketData.tickets[index].selected && (
          <Form.Select
            onChange={(e) => {
              console.log(e.target.value);
              //assigning technician to ticket
              if (e.target.value !== "0") {
                dispatch(
                  assignTicketToTechnician({
                    technician: e.target.value,
                    ticketId: index,
                  })
                );
                dispatch(
                  assignTechnician({ index: index, technician: e.target.value })
                );
              } else {
                dispatch(unAssignTechnicianByTicketId({ ticketId: index }));
                console.log(e.target.value);
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
