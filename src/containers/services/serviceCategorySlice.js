// In serviceCategorySlice.js

import { createSlice } from '@reduxjs/toolkit';

export const serviceCategorySlice = createSlice({
  name: 'serviceCategory',
  initialState: {
    serviceCategories: [],
    isServiceCategoriesDataFetched: false
  },
  reducers: {
    setServiceCategories: (state, action) => {
      state.serviceCategories = action.payload;
    },
    addServiceCategory: (state, action) => {
      state.serviceCategories.push(action.payload);
    },
    deleteServiceCategory: (state, action) => {
      state.serviceCategories = state.serviceCategories.filter(serviceCategory => serviceCategory._id !== action.payload._id);
    },
    updateServiceCategory: (state, action) => {
      const { _id, updatedServiceCategory } = action.payload;
      const index = state.serviceCategories.findIndex(serviceCategory => serviceCategory._id === _id);
      if (index !== -1) {
        state.serviceCategories[index] = { ...state.serviceCategories[index], ...updatedServiceCategory };
      }
    },
   
    setServiceCategoriesDataFetched: (state, action) => {
      state.isServiceCategoriesDataFetched = action.payload;
    },
    logoutServiceCategories: (state) => {
      return {
        serviceCategories: [],
        isServiceCategoriesDataFetched: false
      };
    },
  },
});

export const { setServiceCategories, addServiceCategory, deleteServiceCategory, updateServiceCategory, setServiceCategoriesDataFetched, logoutServiceCategories } = serviceCategorySlice.actions;

export default serviceCategorySlice.reducer;
