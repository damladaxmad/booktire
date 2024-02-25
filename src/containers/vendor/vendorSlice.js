// src/containers/vendor/vendorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vendors: [],
  isVendorDataFetched: false
};

export const vendorSlice = createSlice({
  name: 'vendor', // Change slice name
  initialState,
  reducers: {
    setVendors: (state, action) => { // Change function name and state property
      state.vendors = action.payload;
    },
    addVendor: (state, action) => { // Change function name and state property
      state.vendors.push(action.payload);
    },
    deleteVendor: (state, action) => { // Change function name and state property
      state.vendors = state.vendors.filter(vendor => vendor._id !== action.payload._id);
    },
    updateVendor: (state, action) => { // Change function name and state property
      const { _id, updatedVendor } = action.payload;
      const index = state.vendors.findIndex(vendor => vendor._id === _id);
      if (index !== -1) {
        state.vendors[index] = { ...state.vendors[index], ...updatedVendor };
      }
    },
    updateVendorBalance: (state, action) => { // Change function name and state property
      const { _id, newBalance } = action.payload;
      console.log(newBalance)
      const index = state.vendors.findIndex(vendor => vendor._id === _id);
      if (index !== -1) {
        state.vendors[index].balance = newBalance;
      }
    },
    setVendorDataFetched: (state, action) => { // Change function name and state property
      state.isVendorDataFetched = action.payload;
    },
    logoutVendors: (state, action) => { // Change function name
      return {
        vendors: [],
        isVendorDataFetched: false
      }; // Reset state to initial state
    },
  },
});

export const { setVendors, addVendor, deleteVendor, updateVendor, updateVendorBalance, 
  setVendorDataFetched, logoutVendors } = vendorSlice.actions; // Change action names

export default vendorSlice.reducer;
