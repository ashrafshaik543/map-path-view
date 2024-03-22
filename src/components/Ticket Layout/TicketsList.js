import ListGroup from "react-bootstrap/ListGroup";
import { useSelector } from "react-redux";
import TicketDetails from "./TicketDetails";
import classes from "./TicketsList.module.css";

const TicketsList = () => {
  const ticketData = useSelector((state) => state.ticketData);
  const style = `mb-5 mt-3 align-self-center align-self-lg-start me-3 ${classes.list}`;
  // useEffect(() => {}, []);
  return (
    <div className={style}>
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
