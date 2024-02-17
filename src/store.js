// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './SignupAndLogin/loginSlice';
import customerSlice from './containers/customer/customerSlice';

const store = configureStore({
  reducer: {
    login: loginSlice,
    customers: customerSlice
  },
});

export default store;
