import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [], // Change state property
  isUserDataFetched: false // Change state property
};

export const userSlice = createSlice({ // Change slice name
  name: 'user', 
  initialState,
  reducers: {
    setUsers: (state, action) => { // Change function name and state property
      state.users = action.payload;
    },
    addUser: (state, action) => { // Change function name and state property
      state.users.push(action.payload);
    },
    deleteUser: (state, action) => { // Change function name and state property
      state.users = state.users.filter(user => user._id !== action.payload._id);
    },
    updateUser: (state, action) => { // Change function name and state property
      const { _id, updatedUser } = action.payload;
      const index = state.users.findIndex(user => user._id === _id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...updatedUser };
      }
    },
    updateUserBalance: (state, action) => { // Change function name and state property
      const { _id, newBalance } = action.payload;
      const index = state.users.findIndex(user => user._id === _id);
      if (index !== -1) {
        state.users[index].balance = newBalance;
      }
    },
    setUserDataFetched: (state, action) => { // Change function name and state property
      state.isUserDataFetched = action.payload;
    },
    logoutUsers: (state, action) => { // Change function name
      return {
        users: [],
        isUserDataFetched: false
      }; // Reset state to initial state
    },
  },
});

export const { setUsers, addUser, deleteUser, updateUser, updateUserBalance, 
  setUserDataFetched, logoutUsers } = userSlice.actions; // Change action names

export default userSlice.reducer;
