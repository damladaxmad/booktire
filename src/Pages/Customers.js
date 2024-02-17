import { Typography } from "@mui/material";
import { MdAdd } from "react-icons/md";
import { useState } from "react";
import Table from "../utils/Table";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, deleteCustomer, setCustomers, updateCustomer } from "../containers/customer/customerSlice";
import { constants } from "../Helpers/constantsFile";
import useApiHook from "../hooks/useApiHook";
import Register from "../utils/Register";
import { deleteFunction } from "../funcrions/deleteStuff";
import useRegisterForm from "../hooks/useRegister";
import CustomButton from "../reusables/CustomButton";
import CustomRibbon from "../reusables/CustomRibbon";
import { fields } from "../containers/customer/customerModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const parentDivStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  alignItems: "center",
  width: "95%",
  margin: "auto"
}

const secondarDivStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  margin: "auto",
}

export default function Customers() {
  const [query, setQuery] = useState("")
  const activeUser = useSelector(state => state.login.activeUser)
  const token = useSelector(state => state.login.token)

  const { showRegister, update, toBeUpdatedCustomer,
    handleUpdate, handleHide, handleShowRegister } = useRegisterForm()

  const dispatch = useDispatch()

  const customers = JSON.parse(JSON.stringify(useSelector(state => state.customers?.customers || [])))

  const notify = () => toast("Customer Created successfully", {
autoClose: 3000,
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

  const { data, loading, error } = useApiHook(
    `${constants.baseUrl}/customers/get-business-customers/${activeUser?.business?._id}`,
    (data) => {
      console.log(data?.customers)
      dispatch(setCustomers(data?.customers))
    }
  )

  const handleSearchChange = (value) => {
    setQuery(value);
  };

  return (
    <div style={parentDivStyle}>

      <div style={secondarDivStyle}>

        <Typography style={{ fontWeight: "600", fontSize: "25px" }}>
          Customers</Typography>

        <CustomButton bgColor={constants.pColor}
          startIcon={<MdAdd
            style={{
              color: "white",
            }}
          />}
          text="CREATE CUSTOMERS" fontSize="13px"
          onClick={handleShowRegister}
        />
      </div>

      <CustomRibbon query={query} setQuery={handleSearchChange} />

      <Table
        data={handler(customers)} columns={columns}
        state={loading ? "loading.." : error ? error : "no data to display"}
        onUpdate={(data) => {
          handleUpdate(data)
        }}

        onDelete={(data) => {
          deleteFunction("Customer Deletion",
            data.name,
            `${constants.baseUrl}/customers/close-customer-statement/${data?._id}`,
            token,
            () => { dispatch(deleteCustomer(data)) })
        }} />

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
          notify()
        }}
        onUpdate={
          (data) => {
            dispatch(updateCustomer({
              _id: data?.customer?._id,
              updatedCustomer: data?.customer
            }));
          }
        } />}
         <ToastContainer />

    </div>
  )
}