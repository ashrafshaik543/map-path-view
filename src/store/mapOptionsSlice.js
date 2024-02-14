import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  center: [-74.8732823, 42.66520382],
  bounds: null,
  zoom: 3.6,
  routeCoordinates: null,
};

const mapOptionsSlice = createSlice({
  name: "mapOptions",
  initialState,
  reducers: {
    upadateCenter(state, action) {
      state.center = action.payload.newCenter;
    },
    updateRouteCoordinates(state, action) {
      state.routeCoordinates = action.payload.newCoordinates;
    },
    updateBounds(state, action) {
      state.bounds = action.payload.bounds;
    },
  },
});

export const { updateRouteCoordinates, updateBounds } = mapOptionsSlice.actions;

export default mapOptionsSlice.reducer;
