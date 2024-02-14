import { createSlice } from "@reduxjs/toolkit";

/*
  addressDetialsSchema
  customerId
  address
  geocode [lat long]
*/

const initialState = { addressDetails: [] };

const customerAddressDataSlice = createSlice({
  name: "customerAddress",
  initialState,
  reducers: {
    //adding customer address details
    addToAddressDetails(state, action) {
      state.addressDetails.push(action.payload.newAddressDetail);
    },
    //updating or setting the customer address details
    updateAddressDetailsArray(state, action) {
      state.addressDetails = action.payload.newAddressDetails;
    },
  },
});

export const { addToAddressDetails, updateAddressDetailsArray } =
  customerAddressDataSlice.actions;
export default customerAddressDataSlice.reducer;
