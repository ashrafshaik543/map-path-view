import { configureStore } from "@reduxjs/toolkit";

import ticketDataReducer from "./store-slice/ticketDataSlice";
import mapOptionsReducer from "./store-slice/mapOptionsSlice";
import customerDataReducer from "./store-slice/customerDataSlice";
import customerAddressDataReducer from "./store-slice/customerAddressDataSlice";

const store = configureStore({
  reducer: {
    ticketData: ticketDataReducer,
    mapOptions: mapOptionsReducer,
    customerData: customerDataReducer,
    customerAddressData: customerAddressDataReducer,
  },
});

export default store;
