import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [], // Changed state property from 'users' to 'employees'
  isEmployeeDataFetched: false // Changed state property from 'isUserDataFetched' to 'isEmployeeDataFetched'
};

export const employeeSlice = createSlice({
  name: 'employee', // Changed slice name from 'user' to 'employee'
  initialState,
  reducers: {
    setEmployees: (state, action) => { // Changed function name and state property
      state.employees = action.payload;
    },
    addEmployee: (state, action) => { // Changed function name and state property
      state.employees.push(action.payload);
    },
    deleteEmployee: (state, action) => { // Changed function name and state property
      state.employees = state.employees.filter(employee => employee._id !== action.payload._id);
    },
    updateEmployee: (state, action) => { // Changed function name and state property
      const { _id, updatedEmployee } = action.payload;
      const index = state.employees.findIndex(employee => employee._id === _id);
      if (index !== -1) {
        state.employees[index] = { ...state.employees[index], ...updatedEmployee };
      }
    },
    updateEmployeeBalance: (state, action) => { // Changed function name and state property
      const { _id, newBalance } = action.payload;
      const index = state.employees.findIndex(employee => employee._id === _id);
      if (index !== -1) {
        state.employees[index].balance = newBalance;
      }
    },
    setEmployeeDataFetched: (state, action) => { // Changed function name and state property
      state.isEmployeeDataFetched = action.payload;
    },
    logoutEmployees: (state, action) => { // Changed function name
      return {
        employees: [],
        isEmployeeDataFetched: false
      }; // Reset state to initial state
    },
  },
});

export const { setEmployees, addEmployee, deleteEmployee, updateEmployee, updateEmployeeBalance, 
  setEmployeeDataFetched, logoutEmployees } = employeeSlice.actions; // Changed action names

export default employeeSlice.reducer;
