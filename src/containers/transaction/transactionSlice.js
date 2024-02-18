// transactionsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction(state, action) {
      state.transactions.push(action.payload);
    },
    updateTransaction(state, action) {
      const { id, updatedTransaction } = action.payload;
      const index = state.transactions.findIndex(transaction => transaction.id === id);
      if (index !== -1) {
        state.transactions[index] = updatedTransaction;
      }
    },
    deleteTransaction(state, action) {
      const id = action.payload;
      state.transactions = state.transactions.filter(transaction => transaction.id !== id);
    },
    setTransactions(state, action) {
      state.transactions = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setTransactions,
  setLoading,
  setError,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
