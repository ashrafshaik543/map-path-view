import { updateRouteCoordinates } from "./mapOptionsSlice";
import {
  addToList,
  removeFromList,
  increaseConunter,
  decreaseCounter,
} from "./ticketDataSlice";

export const setRouteDirections = (ticketData, ticket, actionType, index) => {
  return async (dispatch, getState) => {
    if (actionType === "add") {
      dispatch(increaseConunter());
      dispatch(addToList({ newTicket: ticket }));
      if (getState().ticketData.tickets.length < 2) {
        dispatch(updateRouteCoordinates({ newCoordinates: null }));
        return;
      }
    } else {
      let tempTicketData = [...getState().ticketData.tickets];
      tempTicketData.splice(index, 1);
      dispatch(decreaseCounter());
      dispatch(removeFromList({ updatedTickets: tempTicketData }));

      if (getState().ticketData.tickets.length < 2) {
        dispatch(updateRouteCoordinates({ newCoordinates: null }));
        return;
      }
    }
  };
};
