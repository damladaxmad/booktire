import { createSlice } from '@reduxjs/toolkit';

export const customerSlice = createSlice({
  name: 'login',
  initialState: {
    customers: [],
    isCustomerDataFetched: false
  },
  reducers: {
    setCustomers: (state, action) => {
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
    updateCustomerBalance: (state, action) => {
      const { _id, newBalance } = action.payload;
      console.log(newBalance)
      const index = state.customers.findIndex(customer => customer._id === _id);
      if (index !== -1) {
        state.customers[index].balance = newBalance;
      }
    },
    setCustomerDataFetched: (state, action) => {
      state.isCustomerDataFetched = action.payload;
    },
  },
});

export const { setCustomers, addCustomer, deleteCustomer, updateCustomer, updateCustomerBalance, setCustomerDataFetched } = customerSlice.actions;

export default customerSlice.reducer;
