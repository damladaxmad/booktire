// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './SignupAndLogin/loginSlice';
import customerSlice from './containers/customer/customerSlice';
import transactionSlice from './containers/transaction/transactionSlice';
import productSlice from './containers/products/productSlice';

const store = configureStore({
  reducer: {
    login: loginSlice,
    customers: customerSlice,
    transactions: transactionSlice,
    products: productSlice
  },
});

export default store;
