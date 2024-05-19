// src/containers/customer/customerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  qarashaad: [],
  isQarashaadDataFetched: false
};

export const qarashaadSlice = createSlice({
  name: 'qarashaad',
  initialState,
  reducers: {
    setQarashaad: (state, action) => {
      state.qarashaad = action.payload;
    },
    addQarashaad: (state, action) => {
      state.qarashaad.push(action.payload);
    },
    deleteQarashaad: (state, action) => {
      state.qarashaad = state.qarashaad.filter(customer => customer._id !== action.payload._id);
    },
    updateQarashaad: (state, action) => {
      const { _id, updatedQarashaad } = action.payload;
      const index = state.qarashaad.findIndex(qarash => qarash._id === _id);
      if (index !== -1) {
        state.qarashaad[index] = { ...state.qarashaad[index], ...updatedQarashaad };
      }
    },

    setQarashaadDataFetched: (state, action) => {
      state.isQarashaadDataFetched = action.payload;
    },
    logoutQarashaad: (state, action) => {
      return {
        qarashaad: [],
        isQarashaadDataFetched: false
      }; // Reset state to initial state
    },
  },
});

export const { setQarashaad, addQarashaad, deleteQarashaad, updateQarashaad, setQarashaadDataFetched, logoutQarashaad } = qarashaadSlice.actions;

export default qarashaadSlice.reducer;
