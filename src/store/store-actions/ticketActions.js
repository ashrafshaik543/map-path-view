import { updateRouteCoordinates } from "../store-slice/mapOptionsSlice";
import { unAssignTechnicianByTicketId } from "../store-slice/technicianDataSlice";
import {
  addToList,
  removeFromList,
  increaseConunter,
  decreaseCounter,
} from "../store-slice/ticketDataSlice";

export const setRouteDirections = (ticket, actionType, index) => {
  return async (dispatch, getState) => {
    if (actionType === "add") {
      //adding ticket to the ticket details list
      if (getState().ticketData.tickets.length === 0) {
        dispatch(
          addToList({
            newTicket: { ...ticket, id: 0 },
          })
        );
      } else {
        dispatch(
          addToList({
            newTicket: {
              ...ticket,
              id:
                getState().ticketData.tickets[
                  getState().ticketData.tickets.length - 1
                ].id + 1,
            },
          })
        );
      }

      if (getState().ticketData.tickets.length < 2) {
        dispatch(updateRouteCoordinates({ newCoordinates: null }));
        return;
      }
    } else {
      //removing the ticket from the ticket details list
      let tempTicketData = [...getState().ticketData.tickets];
      tempTicketData.splice(index, 1);
      dispatch(
        unAssignTechnicianByTicketId({
          ticketId: getState().ticketData.tickets[index].id,
        })
      );
      dispatch(removeFromList({ updatedTickets: tempTicketData }));

      if (getState().ticketData.tickets.length < 2) {
        dispatch(updateRouteCoordinates({ newCoordinates: null }));
        return;
      }
    }
  };
};
