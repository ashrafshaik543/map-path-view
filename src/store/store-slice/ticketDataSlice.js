import { createSlice } from "@reduxjs/toolkit";

const initialState = { tickets: [], routeCoordinates: null, idCounter: -1 };

/*
schema
 id
 customer id
 job description
 selected
 technician
*/

const ticketDataSlice = createSlice({
  name: "ticketData",
  initialState,
  reducers: {
    addToList(state, action) {
      state.tickets.push(action.payload.newTicket);
    },
    removeFromList(state, action) {
      state.tickets = action.payload.updatedTickets;
    },
    updateRouteCoordinates(state, action) {
      state.routeCoordinates = action.payload.newCoordinates;
    },
    changeTicketCheckStatus(state, action) {
      state.tickets[action.payload.index].selected = action.payload.status;
    },
    //counter for ticket id
    increaseConunter(state) {
      state.idCounter++;
    },
    decreaseCounter(state) {
      state.idCounter--;
    },
    //assign or unassign a technician to the ticket
    assignTechnician(state, action) {
      state.tickets[action.payload.index].technician =
        action.payload.technician;
    },
    unassignTechnician(state, action) {
      delete state.tickets[action.payload.index].technician;
    },
    assignTechnicianToTickets(state, action) {
      let tempState = { ...state };
      tempState.tickets.forEach((ticket, i) => {
        if (action.payload.assignedTicketIds.includes(ticket.id)) {
          tempState.tickets[i].selected = true;
          tempState.tickets[i].technician = action.payload.technician;
        }
      });
      state = { ...tempState };
    },
  },
});

export const {
  addToList,
  removeFromList,
  upadateCenter,
  updateLongestDistanceFromCenter,
  updateBounds,
  updateRouteCoordinates,
  changeTicketCheckStatus,
  increaseConunter,
  decreaseCounter,
  assignTechnician,
  unassignTechnician,
  assignTechnicianToTickets,
} = ticketDataSlice.actions;

export default ticketDataSlice.reducer;
