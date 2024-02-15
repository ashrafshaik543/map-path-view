import { configureStore } from "@reduxjs/toolkit";

import ticketDataReducer from "./store-slice/ticketDataSlice";
import mapOptionsReducer from "./store-slice/mapOptionsSlice";
import customerDataReducer from "./store-slice/customerDataSlice";
import customerAddressDataReducer from "./store-slice/customerAddressDataSlice";
import technicianDataReducer from "./store-slice/technicianDataSlice";
const store = configureStore({
  reducer: {
    ticketData: ticketDataReducer,
    mapOptions: mapOptionsReducer,
    customerData: customerDataReducer,
    customerAddressData: customerAddressDataReducer,
    technicianData: technicianDataReducer,
  },
});

export default store;
