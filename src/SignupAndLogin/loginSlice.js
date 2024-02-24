import { createSlice } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isLogin: false,
    activeUser: "",
    token: "",
    mySocketId: ""
  },
  reducers: {
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setActiveUser: (state, action) => {
      state.activeUser = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setSocketId: (state, action) => {
      state.mySocketId = action.payload;
    },
    logout: (state, action) => {
      return {
        isLogin: false,
        activeUser: "",
        token: "",
        mySocketId: ""
      }; 
    },
  },
});

export const { setIsLogin, setActiveUser, setToken, setSocketId, logout } = loginSlice.actions;

export default loginSlice.reducer;
