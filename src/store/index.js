import { configureStore } from "@reduxjs/toolkit";

import mapDataReducer from "./mapDataSlice";
import ticketDataReducer from "./ticketDataSlice";
import mapOptionsReducer from "./mapOptionsSlice";
import customerDataReducer from "./customerDataSlice";
import customerAddressDataReducer from "./customerAddressDataSlice";

const store = configureStore({
  reducer: {
    mapData: mapDataReducer,
    ticketData: ticketDataReducer,
    mapOptions: mapOptionsReducer,
    customerData: customerDataReducer,
    customerAddressData: customerAddressDataReducer,
  },
});

export default store;
