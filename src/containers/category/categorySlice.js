import { createSlice } from '@reduxjs/toolkit';

export const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    isCategoriesDataFetched: false
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(category => category._id !== action.payload._id);
    },
    updateCategory: (state, action) => {
      const { _id, updatedCategory } = action.payload;
      const index = state.categories.findIndex(category => category._id === _id);
      if (index !== -1) {
        state.categories[index] = { ...state.categories[index], ...updatedCategory };
      }
    },
    setCategoryDataFetched: (state, action) => {
      state.isCategoriesDataFetched = action.payload;
    },
    logoutCategories: (state, action) => {
      return {
        categories: [],
        isCategoriesDataFetched: false
      }; 
    },
  },
});

export const { setCategories, addCategory, deleteCategory, updateCategory, setCategoryDataFetched, logoutCategories } = categorySlice.actions;

export default categorySlice.reducer;
