// src/containers/customer/customerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [],
  isCustomerDataFetched: false
};

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
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

    updateCustomerSocketBalance: (state, action) => {
      const { _id, transaction } = action.payload;
      console.log(transaction, _id)
      const index = state.customers.findIndex(customer => customer._id === _id);
      if (index !== -1) {
        state.customers[index].balance += transaction;
      }
    },
    
    setCustomerDataFetched: (state, action) => {
      state.isCustomerDataFetched = action.payload;
    },
    logoutCustomers: (state, action) => {
      return {
        customers: [],
        isCustomerDataFetched: false
      }; // Reset state to initial state
    },
  },
});

export const { setCustomers, addCustomer, deleteCustomer, updateCustomer, updateCustomerBalance, 
  updateCustomerSocketBalance, setCustomerDataFetched, logoutCustomers } = customerSlice.actions;

export default customerSlice.reducer;
