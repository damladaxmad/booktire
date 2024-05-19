// src/containers/customer/customerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenseTypes: [],
  isExpenseTypesDataFetched: false
};

export const expenseTypesSlice = createSlice({
  name: 'expenseTypes',
  initialState,
  reducers: {
    setExpenseTypes: (state, action) => {
      state.expenseTypes = action.payload;
    },
    addExpenseType: (state, action) => {
      state.expenseTypes.push(action.payload);
    },
    deleteExpenseType: (state, action) => {
      state.expenseTypes = state.expenseTypes.filter(expenseType => expenseType._id !== action.payload._id);
    },
    updateExpenseType: (state, action) => {
      const { _id, updatedExpenseType } = action.payload;
      const index = state.expenseTypes.findIndex(expenseType => expenseType._id === _id);
      if (index !== -1) {
        state.expenseTypes[index] = { ...state.expenseTypes[index], ...updatedExpenseType };
      }
    },

    setExpenseTypesDataFetched: (state, action) => {
      state.isExpenseTypesDataFetched = action.payload;
    },
    logoutExpenseTypes: (state, action) => {
      return {
        expenseTypes: [],
        isExpenseTypesDataFetched: false
      }; // Reset state to initial state
    },
  },
});

export const { setExpenseTypes, addExpenseType, deleteExpenseType, updateExpenseType, setExpenseTypesDataFetched, logoutExpenseTypes } = expenseTypesSlice.actions;

export default expenseTypesSlice.reducer;
