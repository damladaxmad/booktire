// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './SignupAndLogin/loginSlice';
import customerSlice from './containers/customer/customerSlice';
import transactionSlice from './containers/transaction/transactionSlice';
import productSlice from './containers/products/productSlice';
import vendorSlice from './containers/vendor/vendorSlice';
import userSlice from './containers/user/userSlice';
import categorySlice from './containers/category/categorySlice';

const store = configureStore({
  reducer: {
    login: loginSlice,
    customers: customerSlice,
    vendors: vendorSlice,
    users: userSlice,
    transactions: transactionSlice,
    products: productSlice,
    categories: categorySlice
  },
});

export default store;
