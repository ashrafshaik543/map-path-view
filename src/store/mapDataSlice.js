import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addresses: [],
  center: [38.6013, -99.6649],
  longestDistanceFromCenter: 0,
  bounds: null,
  zoom: 12,
  routeCoordinates: null,
};

const mapDataSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addToList(state, action) {
      // if (state.addresses.length + 1 === 1) {
      //   state.center = action.payload.
      // }
      state.addresses.push({
        address: action.payload.newAddress,
        geocode: action.payload.geocode,
      });
    },
    removeFromList(state, action) {
      let index = 0;
      let indexFound = false;
      for (const addressData of state.addresses) {
        if (addressData.address === action.payload.toRemoveAddress) {
          indexFound = true;
          break;
        } else index++;
      }
      if (indexFound) {
        state.addresses.splice(index, 1);
      }
    },
    upadateCenter(state, action) {
      state.center = action.payload.newCenter;
    },
    updateLongestDistanceFromCenter(state, action) {
      state.longestDistanceFromCenter = action.payload.newLongestDistance;
    },
    updateBounds(state, action) {
      state.bounds = action.payload.bounds;
    },
    updateRouteCoordinates(state, action) {
      state.routeCoordinates = action.payload.newCoordinates;
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
} = mapDataSlice.actions;
export default mapDataSlice.reducer;
