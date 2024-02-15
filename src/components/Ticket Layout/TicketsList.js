import ListGroup from "react-bootstrap/ListGroup";
import { useSelector } from "react-redux";
import TicketDetails from "./TicketDetails";

const TicketsList = () => {
  const ticketData = useSelector((state) => state.ticketData);

  // useEffect(() => {}, []);
  return (
    <div style={{ width: "35%" }} className="mb-5 mt-3">
      <p>
        <b>Tickets List:</b>
      </p>
      {ticketData.tickets.length > 0 ? (
        <ListGroup>
          {ticketData.tickets.map((ticket, i) => {
            return (
              <div key={ticket.id}>
                <TicketDetails
                  index={i}
                  ticket={ticket}
                  ticketData={ticketData}
                />
              </div>
            );
          })}
        </ListGroup>
      ) : (
        <p>No addresses entered yet</p>
      )}
    </div>
  );
};

export default TicketsList;
