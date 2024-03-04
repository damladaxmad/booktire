import { useEffect, useState } from "react";
import Table from "../utils/Table";
import { useDispatch, useSelector } from "react-redux";
import { addUser, deleteUser, setUserDataFetched, setUsers, updateUser } from "../containers/user/userSlice"; // Update Redux actions
import { constants } from "../Helpers/constantsFile";
import Register from "../utils/Register";
import { deleteFunction } from "../funcrions/deleteStuff";
import useRegisterForm from "../hooks/useRegister";
import CustomRibbon from "../reusables/CustomRibbon";
import { fields } from "../containers/user/userModal"; // Update Redux fields
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Transactions from "../containers/transaction/Transactions";
import TitleComponent from "../reusables/TitleComponent.";
import io from 'socket.io-client';
import useReadData from "../hooks/useReadData";
import useEventHandler from "../hooks/useEventHandler";
import axios from "axios";
import Privillages from "../containers/adminstration/Privillages";

const parentDivStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  alignItems: "center",
  width: "95%",
  margin: "auto"
}

export default function Users() { // Change component name
  const [query, setQuery] = useState("")
  const [showTransactions, setShowTransactions] = useState(false)
  const [showPrivillages, setShowPrivillages] = useState(false)
  const [instance, setInstance] = useState(null)
  const { business } = useSelector(state => state.login.activeUser)
  const mySocketId = useSelector(state => state?.login?.mySocketId)
  const token = useSelector(state => state.login.token)
  const url = `${constants.baseUrl}/users/get-business-users/${business?._id}` // Update URL
  const users = JSON.parse(JSON.stringify(useSelector(state => state.users?.users || []))) // Update Redux slice name
  
  const dispatch = useDispatch()
  
  const { showRegister, update, toBeUpdatedCustomer: toBeUpdatedUser, // Update variable names
    handleUpdate, handleHide, handleShowRegister } = useRegisterForm() // Update hook


  const { loading, error } = useReadData(
    url,
    setUsers,
    setUserDataFetched,
    state => state.users.isUsersDataFetched,
    "users"
  );

  const notify = (message) => toast(message, {
    autoClose: 2700,
    hideProgressBar: true,
    theme: "light",
    position: "top-center"
  });

  const columns = [
    { title: "Full Name", field: "name", width: "24%" },
    { title: "User Name", field: "username" },
    { title: "User Role", field: "role" },
    { title: "User Status", field: "status" },
  ];

  const handler = (data) => {
    if (data?.length > 0) {
      if (query == "") {
        return data
          .filter((instance) => {
            return instance
          })
      } else {
        return data?.filter(
          (instance) => {
              return (instance?.name.toLowerCase().includes(query.toLocaleLowerCase()) ||
              instance.username.toLowerCase().includes(query.toLocaleLowerCase()))
          }
        );
      }
    } else {
      return;
    }
  };

  const handleSearchChange = (value) => {
    setQuery(value);
  };

  const resetUser = (data) => {
    axios.post(`${constants.baseUrl}/users/reset-password/${data?._id}`, {
      password: "12345", passwordConfirm: "12345"
    },
    {
      headers: {
        'authorization': token
      },
    }).then(res => {
      alert("Succesfully Reset User")
    }).catch((err) => {
      alert(err.response?.data?.message)
    })
  }

  const deleteUser = (data) => {
    deleteFunction(true, "User Deletion", // Update title
    data.name,
    `${constants.baseUrl}/users/${data?._id}`, // Update URL
    token,
    () => { dispatch(deleteUser(data)) })
  }


  const { handleEvent } = useEventHandler();

  useEffect(() => {
    const socket = io.connect('https://booktire-api.onrender.com');
    socket.on('userEvent', (data) => { // Update event name
      handleEvent(data, mySocketId, business?._id, "userEvent"); // Update event name
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={parentDivStyle}>

      {showPrivillages && <Privillages user = {instance} hide = {()=> setShowPrivillages(false)}/>}

      {!showPrivillages && <TitleComponent title="Users" // Update title
        btnName="Create Users" onClick={handleShowRegister} />}

      {!showPrivillages && <CustomRibbon query={query}
        setQuery={handleSearchChange} />}

      {!showPrivillages && <Table
        data={handler(users)} columns={columns} // Update variable name
        name="User" // Update name
        state={loading ? "loading.." : error ? error : "no data to display"}
        onUpdate={(data) => {
          handleUpdate(data)
        }}

        onSeeTransactions={(data) => {
          setInstance(data)
          setShowTransactions(true)
        }}

        onDelete={(data) => {
          deleteUser(data) // Update Redux action
        }} 
        onResetUser = {(data)=> {
          resetUser(data)
        }}
        onGiveAccess = {(data)=> {
          setInstance(data)
          setShowPrivillages(true)
        }}
        />}

      {showRegister && <Register
        instance={toBeUpdatedUser} // Update variable name
        update={update}
        name="User"
        fields={fields}
        url="users"
        business={business?._id}
        hideModal={() => { handleHide() }}
        store={(data) => {
          dispatch(addUser(data?.user)) 
          notify("User created successfully") 
        }}
        onUpdate={
          (data) => {
            dispatch(updateUser({ 
              _id: data?.user?._id,
              updatedUser: data?.user
            }));
            notify("User updated successfully") // Update message
          }
        } />}

      <ToastContainer />

    </div>
  )
}
