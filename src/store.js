// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './SignupAndLogin/loginSlice';
import customerSlice from './containers/customer/customerSlice';
import transactionSlice from './containers/transaction/transactionSlice';

const store = configureStore({
  reducer: {
    login: loginSlice,
    customers: customerSlice,
    transactions: transactionSlice
  },
});

export default store;
