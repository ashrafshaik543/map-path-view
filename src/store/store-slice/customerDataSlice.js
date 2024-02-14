import { createSlice } from "@reduxjs/toolkit";

/*
  customer schema:
  id 
  name
*/

const initialState = { customers: [] };

const customerDataSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    //adding customer details
    addCustomer(state, action) {
      state.customers.push(action.payload.newCustomer);
    },
    //updating or setting the customer details
    updateCustomersArray(state, action) {
      state.customers = action.payload.newCustomers;
    },
    // getCustomer
  },
});

export const { addCustomer, updateCustomersArray } = customerDataSlice.actions;
export default customerDataSlice.reducer;
