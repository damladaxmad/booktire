import { createSlice } from '@reduxjs/toolkit';

export const customerSlice = createSlice({
  name: 'login',
  initialState: {
    customers: []
  },
  reducers: {
    setCustomers: (state, action) => {
      console.log(action.payload)
      state.customers = action.payload;
    },
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(customer => customer._id !== action.payload._id);
    },
    updateCustomer: (state, action) => {
        const { _id, updatedCustomer } = action.payload;
        const index = state.customers.findIndex(customer => customer._id === _id);
        if (index !== -1) {
          state.customers[index] = { ...state.customers[index], ...updatedCustomer };
        }
      },
  },
});

export const { setCustomers, addCustomer, deleteCustomer, updateCustomer } = customerSlice.actions;

export default customerSlice.reducer;
