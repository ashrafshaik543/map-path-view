import { configureStore } from "@reduxjs/toolkit";

import mapDataReducer from "./mapDataSlice";

const store = configureStore({
  reducer: {
    mapData: mapDataReducer,
  },
});

export default store;
