import { createSlice } from "@reduxjs/toolkit";

/*
schema
 technicianData.technician -> array of ticket ids (one, two, three)
 

*/

/*
[
    [-74.8732823, 42.66520382],
    [-78.780514, 41.884992],
    [-79.132107, 38.483322],
  ]
*/

const initialState = {
  one: [],
  two: [],
  three: [],
  technicianGeocodes: {
    one: [-74.8732823, 42.66520382],
    two: [-78.780514, 41.884992],
    three: [-79.132107, 38.483322],
  },
};
const technicianDataSlice = createSlice({
  name: "technicianData",
  initialState,
  reducers: {
    assignTicketToTechnician(state, action) {
      let tempState = { ...state };
      let technician = null;
      let index = null;
      for (const tech in tempState) {
        if (tech === "technicianGeocodes") break;
        if (
          [...tempState[tech]].findIndex(
            (id) => id === action.payload.ticketId
          ) !== -1
        ) {
          technician = `${tech}`;
          index = [...tempState[tech]].findIndex(
            (id) => id === action.payload.ticketId
          );
          break;
        }
      }
      if (technician) tempState[technician].splice(index, 1);
      tempState[action.payload.technician].push(action.payload.ticketId);
      console.log(tempState);
      state = tempState;
    },
    unAssignTechnicianByTicketId(state, action) {
      // console.log(action.payload.ticketId);
      let technician = null;
      let index = null;
      let tempState = { ...state };
      for (const tech in tempState) {
        if (tech === "technicianGeocodes") break;
        if (
          [...tempState[tech]].findIndex(
            (id) => id === action.payload.ticketId
          ) !== -1
        ) {
          technician = `${tech}`;
          index = [...tempState[tech]].findIndex(
            (id) => id === action.payload.ticketId
          );
          break;
        }
      }
      if (technician) tempState[technician].splice(index, 1);
      state = { ...tempState };
    },
    assignMultipleTicketsToTechnician(state, action) {
      let tempState = { ...state };

      action.payload.assignedTicketIds.forEach((ticketId) => {
        let technician = null;
        let index = null;
        for (const tech in tempState) {
          if (tech === "technicianGeocodes") break;
          if ([...tempState[tech]].findIndex((id) => id === ticketId) !== -1) {
            technician = `${tech}`;
            index = [...tempState[tech]].findIndex((id) => id === ticketId);
            break;
          }
        }
        if (technician) tempState[technician].splice(index, 1);
      });

      tempState[action.payload.technician].push(
        ...action.payload.assignedTicketIds
      );
      state = { ...tempState };
    },
  },
});

export const {
  assignTicketToTechnician,
  unAssignTechnicianByTicketId,
  assignMultipleTicketsToTechnician,
} = technicianDataSlice.actions;
export default technicianDataSlice.reducer;
