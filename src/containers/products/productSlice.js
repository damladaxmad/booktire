// In productSlice.js

import { createSlice } from '@reduxjs/toolkit';

export const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    isProductsDataFetched: false
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(product => product._id !== action.payload._id);
    },
    updateProduct: (state, action) => {
      const { _id, updatedProduct } = action.payload;
      const index = state.products.findIndex(product => product._id === _id);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...updatedProduct };
      }
    },
    updateProductQuantity: (state, action) => {
      const { productId, quantity, type } = action.payload;
      const product = state.products.find(product => product._id === productId);
      if (!product) return
      if (type == "sale") {
        product.quantity -= quantity; 
      }
      if (type == "purchase") {
        product.quantity += quantity; 
      }
    },
    setProductDataFetched: (state, action) => {
      state.isProductsDataFetched = action.payload;
    },
    logoutProducts: (state) => {
      return {
        products: [],
        isProductsDataFetched: false
      };
    },
  },
});

export const { setProducts, addProduct, deleteProduct, updateProduct, updateProductQuantity, setProductDataFetched, logoutProducts } = productSlice.actions;

export default productSlice.reducer;
