import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  center: [],
  bounds: null,
};

const mapData = createSlice({
  name: "mapOptions",
  initialState,
  reducers: {
    upadateCenter(state, action) {
      state.center = action.payload.newCenter;
    },
  },
});

export const { upadateCenter } = mapData.actions;

export default mapData.reducer;
