// In serviceSlice.js

import { createSlice } from '@reduxjs/toolkit';

export const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    isServicesDataFetched: false
  },
  reducers: {
    setServices: (state, action) => {
      state.services = action.payload;
    },
    addService: (state, action) => {
      state.services.push(action.payload);
    },
    deleteService: (state, action) => {
      state.services = state.services.filter(service => service._id !== action.payload._id);
    },
    updateService: (state, action) => {
      const { _id, updatedService } = action.payload;
      const index = state.services.findIndex(service => service._id === _id);
      if (index !== -1) {
        state.services[index] = { ...state.services[index], ...updatedService };
      }
    },
    updateServiceQuantity: (state, action) => {
      const { serviceId, quantity } = action.payload;
      const service = state.services.find(service => service._id === serviceId);
      if (service) {
        service.quantity -= quantity; 
      }
    },
    setServiceDataFetched: (state, action) => {
      state.isServicesDataFetched = action.payload;
    },
    logoutServices: (state) => {
      return {
        services: [],
        isServicesDataFetched: false
      };
    },
  },
});

export const { setServices, addService, deleteService, updateService, updateServiceQuantity, setServiceDataFetched, logoutServices } = serviceSlice.actions;

export default serviceSlice.reducer;
