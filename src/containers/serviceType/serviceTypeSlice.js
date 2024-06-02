import { createSlice } from '@reduxjs/toolkit';

export const serviceTypeSlice = createSlice({
  name: 'serviceTypes',
  initialState: {
    serviceTypes: [],
    isServiceTypesDataFetched: false
  },
  reducers: {
    setServiceTypes: (state, action) => {
      state.serviceTypes = action.payload;
    },
    addServiceType: (state, action) => {
      state.serviceTypes.push(action.payload);
    },
    deleteServiceType: (state, action) => {
      state.serviceTypes = state.serviceTypes.filter(serviceType => serviceType._id !== action.payload._id);
    },
    updateServiceType: (state, action) => {
      const { _id, updatedServiceType } = action.payload;
      const index = state.serviceTypes.findIndex(serviceType => serviceType._id === _id);
      if (index !== -1) {
        state.serviceTypes[index] = { ...state.serviceTypes[index], ...updatedServiceType };
      }
    },
    setServiceTypeDataFetched: (state, action) => {
      state.isServiceTypesDataFetched = action.payload;
    },
    logoutServiceTypes: (state) => {
      return {
        serviceTypes: [],
        isServiceTypesDataFetched: false
      };
    },
  },
});

export const { setServiceTypes, addServiceType, deleteServiceType, updateServiceType, setServiceTypeDataFetched, logoutServiceTypes } = serviceTypeSlice.actions;

export default serviceTypeSlice.reducer;
