import Table from "../utils/Table";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, deleteCustomer, setCustomerDataFetched, setCustomers, updateCustomer, updateCustomerAqrisHore, updateCustomerSocketBalance } from "../containers/customer/customerSlice";
import { constants } from "../Helpers/constantsFile";
import Register from "../utils/Register";
import { deleteFunction } from "../funcrions/deleteStuff";
import useRegisterForm from "../hooks/useRegister";
import CustomRibbon from "../reusables/CustomRibbon";
import { fields } from "../containers/qarashaad/qarashaadModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Transactions from "../containers/transaction/Transactions";
import TitleComponent from "../reusables/TitleComponent.";
import useReadData from "../hooks/useReadData";
import { addQarashaad, deleteQarashaad, setQarashaad, setQarashaadDataFetched, updateQarashaad } from "../containers/qarashaad/qarashaadSlice";
import moment from "moment";
import { useState } from "react";

const parentDivStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  alignItems: "center",
  width: "95%",
  margin: "auto"
}

export default function Qarashaad() {
  const [query, setQuery] = useState("")
  const [showTransactions, setShowTransactions] = useState(false)
  const [instance, setInstance] = useState(null)
  const { business, privileges } = useSelector(state => state.login.activeUser)
  const token = useSelector(state => state.login.token)
  const url = `${constants.baseUrl}/expenses/get-business-expense/${business?._id}`
  const qarashaad = JSON.parse(JSON.stringify(useSelector(state => state.qarashaad?.qarashaad || [])))
  
  const dispatch = useDispatch()

  console.log(qarashaad)
  
  const { showRegister, update, toBeUpdatedCustomer,
    handleUpdate, handleHide, handleShowRegister } = useRegisterForm()

    const { loading, error } = useReadData(
     url,
      setQarashaad,
      setQarashaadDataFetched,
      state => state.qarashaad.isQarashaadDataFetched,
      "expenses"
  );

  const notify = (message) => toast(message, {
    autoClose: 2700,
    hideProgressBar: true,
    theme: "light",
    position: "top-center"
  });

  const columns = [
    { title: "Description", field: "description", width: "84%" },
    { title: "Amount", field: "amount" },
    { title: "Type", field: "exoenseType", render: (data) => <p>{data?.expenseType?.name}</p> },
    { title: "Date", field: "date", render: (data) => <p>{moment(data?.date).format("YYYY-MM-DD")}</p> },
  ];

  const handler = (data) => {
    if (data?.length > 0) {
      if (query == "") {
        return data
          .filter((instance) => {
            if (instance?.status == "closed") return
              return instance
          })
      } else {
        return data?.filter(
          (instance) => {
            if (instance?.status == "closed") return
              return instance?.description.toLowerCase().includes(query.toLocaleLowerCase())
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



// if (!privileges?.includes("Customers")) return (
//   <div style = {parentDivStyle}>
//     <Typography> You cannot access this tab</Typography>
//   </div>
// )


  return (
    <div style={parentDivStyle}>

      {!showTransactions && <TitleComponent title="Qarashaad"
        btnName="Abuur Qarashaad" onClick={handleShowRegister} />}

      {!showTransactions && <CustomRibbon query={query}
        setQuery={handleSearchChange} />}

      {!showTransactions && <Table
        data={handler(qarashaad)} columns={columns}
        name="Qarashaad"
        state={loading ? "loading.." : error ? error : "no data to display"}
        onUpdate={(data) => {
          handleUpdate(data)
        }}

        onSeeTransactions={(data) => {
          setInstance(data)
          setShowTransactions(true)
        }}

        onDelete={(data) => {
          deleteFunction(true, "Qarashaad Deletion",
            data.description,
            `${constants.baseUrl}/expenses/${data?._id}`,
            token,
            () => { dispatch(deleteQarashaad(data)) })
        }} 
        
        onClickRow={(data) => {
          setInstance(data)
          setShowTransactions(true)
        }}
        />}

      {showRegister && <Register
        instance={toBeUpdatedCustomer}
        update={update}
        name="Qarashaad"
        fields={fields}
        url="expenses"
        business={business?._id}
        hideModal={() => { handleHide() }}
        store={(data) => {
          dispatch(addQarashaad(data?.createdExpense))
          notify("Qarashaad created successfully")
        }}
        onUpdate={
          (data) => {
            console.log(data)
            dispatch(updateQarashaad({
              _id: data?.expense?._id,
              updatedQarashaad: data?.expense
            }));
            notify("Qarashaad updated successfully")
          }
        } />}

      <ToastContainer />

    </div>
  )
}