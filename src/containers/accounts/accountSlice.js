import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accounts: [], // Changed state property from 'employees' to 'accounts'
  isAccountDataFetched: false // Changed state property from 'isEmployeeDataFetched' to 'isAccountDataFetched'
};

export const accountSlice = createSlice({
  name: 'account', // Changed slice name from 'employee' to 'account'
  initialState,
  reducers: {
    setAccounts: (state, action) => { // Changed function name and state property
      state.accounts = action.payload;
    },
    addAccount: (state, action) => { // Changed function name and state property
      state.accounts.push(action.payload);
    },
    deleteAccount: (state, action) => { // Changed function name and state property
      state.accounts = state.accounts.filter(account => account._id !== action.payload._id);
    },
    updateAccount: (state, action) => { // Changed function name and state property
      const { _id, updatedAccount } = action.payload;
      const index = state.accounts.findIndex(account => account._id === _id);
      if (index !== -1) {
        state.accounts[index] = { ...state.accounts[index], ...updatedAccount };
      }
    },
    updateAccountBalance: (state, action) => { // Changed function name and state property
      const { _id, newBalance } = action.payload;
      const index = state.accounts.findIndex(account => account._id == _id);
      console.log(state.accounts, _id)
      if (index !== -1) {
        state.accounts[index].balance = newBalance;
      }
    },
    setAccountDataFetched: (state, action) => { // Changed function name and state property
      state.isAccountDataFetched = action.payload;
    },
    logoutAccounts: (state, action) => { // Changed function name
      return {
        accounts: [],
        isAccountDataFetched: false
      }; // Reset state to initial state
    },
  },
});

export const { setAccounts, addAccount, deleteAccount, updateAccount, updateAccountBalance, 
  setAccountDataFetched, logoutAccounts } = accountSlice.actions; // Changed action names

export default accountSlice.reducer;
