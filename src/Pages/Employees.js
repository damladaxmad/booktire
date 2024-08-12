import { useEffect, useState } from "react";
import Table from "../utils/Table";
import { useDispatch, useSelector } from "react-redux";
import { addEmployee, deleteEmployee, setEmployeeDataFetched, setEmployees, updateEmployee } from "../containers/employee/employeeSlice"; // Updated Redux actions
import { constants } from "../Helpers/constantsFile";
import Register from "../utils/Register";
import { deleteFunction } from "../funcrions/deleteStuff";
import useRegisterForm from "../hooks/useRegister";
import CustomRibbon from "../reusables/CustomRibbon";
import { fields } from "../containers/employee/employeeModal"; // Updated Redux fields
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Transactions from "../containers/transaction/Transactions";
import TitleComponent from "../reusables/TitleComponent.";
import io from 'socket.io-client';
import useReadData from "../hooks/useReadData";
import useEventHandler from "../hooks/useEventHandler";
import axios from "axios";

const parentDivStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  alignItems: "center",
  width: "95%",
  margin: "auto"
};

export default function Employees() { // Updated component name
  const [query, setQuery] = useState("");
  const [showTransactions, setShowTransactions] = useState(false);
  const [showPrivileges, setShowPrivileges] = useState(false);
  const [instance, setInstance] = useState(null);
  const { business } = useSelector(state => state.login.activeUser);
  const mySocketId = useSelector(state => state?.login?.mySocketId);
  const token = useSelector(state => state.login.token);
  const url = `${constants.baseUrl}/employees/get-business-employees/${business?._id}`; // Updated URL
  const employees = JSON.parse(JSON.stringify(useSelector(state => state.employees?.employees || []))); // Updated Redux slice name
  
  const dispatch = useDispatch();
  
  const { showRegister, update, toBeUpdatedCustomer: toBeUpdatedEmployee, // Updated variable names
    handleUpdate, handleHide, handleShowRegister } = useRegisterForm(); // Updated hook

  const { loading, error } = useReadData(
    url,
    setEmployees,
    setEmployeeDataFetched,
    state => state.employees.isEmployeeDataFetched,
    "employees"
  );

  const notify = (message) => toast(message, {
    autoClose: 2700,
    hideProgressBar: true,
    theme: "light",
    position: "top-center"
  });

  const columns = [
    { title: "Full Name", field: "name", width: "24%" },
    { title: "Employee Phone", field: "phone" },
    { title: "Employee Status", field: "status" },
  ];

  const handler = (data) => {
    if (data?.length > 0) {
      if (query === "") {
        return data.filter((instance) => instance);
      } else {
        return data?.filter(
          (instance) => (
            instance?.name.toLowerCase().includes(query.toLowerCase()) ||
            instance?.phone.toString().includes(query.toLowerCase())
          )
        );
      }
    } else {
      return;
    }
  };

  const handleSearchChange = (value) => {
    setQuery(value);
  };

  const resetEmployee = (data) => {
    axios.post(`${constants.baseUrl}/employees/reset-password/${data?._id}`, {
      password: "12345", passwordConfirm: "12345"
    },
    {
      headers: {
        'authorization': token
      },
    }).then(res => {
      alert("Successfully Reset Employee");
    }).catch((err) => {
      alert(err.response?.data?.message);
    });
  };

  const deleteEmployeeFun = (data) => {
    deleteFunction(true, "Employee Deletion", // Updated title
      data.name,
      `${constants.baseUrl}/employees/${data?._id}`, // Updated URL
      token,
      () => { dispatch(deleteEmployee(data)); });
  };

  const { handleEvent } = useEventHandler();

  useEffect(() => {
    const socket = io.connect('https://booktire-api.onrender.com');
    socket.on('employeeEvent', (data) => { // Updated event name
      handleEvent(data, mySocketId, business?._id, "employeeEvent"); // Updated event name
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={parentDivStyle}>

      {!showPrivileges && <TitleComponent title="Employees" // Updated title
        btnName="Create Employee" onClick={handleShowRegister} />}

      {!showPrivileges && <CustomRibbon query={query}
        setQuery={handleSearchChange} />}

      {!showPrivileges && <Table
        data={handler(employees)} columns={columns} // Updated variable name
        name="Employee" // Updated name
        state={loading ? "loading.." : error ? error : "no data to display"}
        onUpdate={(data) => {
          handleUpdate(data);
        }}

        onSeeTransactions={(data) => {
          setInstance(data);
          setShowTransactions(true);
        }}

        onDelete={(data) => {
          deleteEmployeeFun(data); // Updated Redux action
        }} 
        />}

      {showRegister && <Register
        instance={toBeUpdatedEmployee} // Updated variable name
        update={update}
        name="Employee"
        fields={fields}
        url="employees"
        business={business?._id}
        hideModal={() => { handleHide(); }}
        store={(data) => {
          dispatch(addEmployee(data?.createdEmployee)); 
          notify("Employee created successfully"); // Updated message
        }}
        onUpdate={(data) => {
          dispatch(updateEmployee({ 
            _id: data?.updatedEmployee?._id,
            updatedEmployee: data?.updatedEmployee
          }));
          notify("Employee updated successfully"); // Updated message
        }} />}

      <ToastContainer />

    </div>
  );
}
