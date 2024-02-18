import { useEffect, useState } from "react";
import Table from "../utils/Table";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, deleteCustomer, setCustomers, updateCustomer } from "../containers/customer/customerSlice";
import { constants } from "../Helpers/constantsFile";
import useApiHook from "../hooks/useApiHook";
import Register from "../utils/Register";
import { deleteFunction } from "../funcrions/deleteStuff";
import useRegisterForm from "../hooks/useRegister";
import CustomRibbon from "../reusables/CustomRibbon";
import { fields } from "../containers/customer/customerModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Transactions from "../containers/customer/Transactions";
import TitleComponent from "../reusables/TitleComponent.";
import axios from "axios";

const parentDivStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  alignItems: "center",
  width: "95%",
  margin: "auto"
}

export default function Customers() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false)
  const [instance, setInstance] = useState(null)
  const activeUser = useSelector(state => state.login.activeUser)
  const token = useSelector(state => state.login.token)
  const url =  `${constants.baseUrl}/customers/get-business-customers/${activeUser?.business?._id}`
  const customers = JSON.parse(JSON.stringify(useSelector(state => state.customers?.customers || [])))

  const { showRegister, update, toBeUpdatedCustomer,
    handleUpdate, handleHide, handleShowRegister } = useRegisterForm()

  const dispatch = useDispatch()

  useEffect(() => {
      let source = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url, {
          headers: {
            'authorization': token
          },
          cancelToken: source.token
        });
        setLoading(false);
        dispatch(setCustomers(response?.data?.data?.customers))
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError("Error getting the data");
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      source.cancel();
    };
  }, [dispatch]);
  
  const notify = (message) => toast(message, {
    autoClose: 2000,
    theme: "dark",
    position: "top-center"
  });

  const columns = [
    { title: "Full Name", field: "name", width: "24%" },
    { title: "Phone Number", field: "phone" },
    { title: "Address", field: "district" },
    {
      title: "Balance",
      field: "balance",
      editable: "never",
      render: (data) => <p> {data?.balance.toFixed(2)}</p>,
    },
  ];

  const handler = (data) => {
    if (data?.length > 0) {
      if (query == "") {
        return data
          .filter((std) => {
            if (std?.status == "closed") return
            if (!std?.type || std?.type == "deynle")
              return std.balance >= 0 || std.balance <= 0;
          })
      } else {
        return data?.filter(
          (std) => {
            if (std?.status == "closed") return
            if (!std?.type || std.type == "deynle")
              return (std?.name.toLowerCase().includes(query) ||
                std.phone.toLowerCase().includes(query))
          }
        );
      }
    } else {
      return;
    }
  };

  // const { loading, error } = useApiHook(
    // `${constants.baseUrl}/customers/get-business-customers/${activeUser?.business?._id}`,
  //   (data) => {
      // console.log("fetched data")
      // dispatch(setCustomers(data?.customers))
  //   }
  // )

  const handleSearchChange = (value) => {
    setQuery(value);
  };

  return (
    <div style={parentDivStyle}>

      {!showTransactions && <TitleComponent title = "Customers"
      btnName = "Create Customers" onClick = {handleShowRegister}/>}

      {!showTransactions && <CustomRibbon query={query} 
      setQuery={handleSearchChange} /> }

      {!showTransactions && <Table
        data={handler(customers)} columns={columns}
        name = "Customer"
        state={loading ? "loading.." : error ? error : "no data to display"}
        onUpdate={(data) => {
          handleUpdate(data)
        }}

        onSeeTransactions={(data)=> {
          setInstance(data)
          setShowTransactions(true)
        }}

        onDelete={(data) => {
          deleteFunction("Customer Deletion",
            data.name,
            `${constants.baseUrl}/customers/close-customer-statement/${data?._id}`,
            token,
            () => { dispatch(deleteCustomer(data)) })
        }} />}

      {showRegister && <Register
        instance={toBeUpdatedCustomer}
        update={update}
        name="Customer"
        fields={fields}
        url="customers"
        business={activeUser?.business?._id}
        hideModal={() => { handleHide() }}
        store={(data) => {
          dispatch(addCustomer(data?.customer))
          notify("Customer created successfully")
        }}
        onUpdate={
          (data) => {
            dispatch(updateCustomer({
              _id: data?.customer?._id,
              updatedCustomer: data?.customer
            }));
            notify("Customer updated successfully")
          }
        } />}

        {showTransactions && <Transactions 
        customer = {instance}
        hideTransactions={()=> setShowTransactions(false)}/>}

        <ToastContainer />

    </div>
  )
}