import { useEffect, useState } from "react";
import Table from "../utils/Table";
import { useDispatch, useSelector } from "react-redux";
import { addVendor, deleteVendor, updateVendor } from "../containers/vendor/vendorSlice"; // Update Redux actions
import { constants } from "../Helpers/constantsFile";
import Register from "../utils/Register";
import { deleteFunction } from "../funcrions/deleteStuff";
import useRegisterForm from "../hooks/useRegister";
import CustomRibbon from "../reusables/CustomRibbon";
import { fields } from "../containers/vendor/vendorModal"; // Update Redux fields
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Transactions from "../containers/transaction/Transactions";
import TitleComponent from "../reusables/TitleComponent.";
import io from 'socket.io-client';
import useReadData from "../hooks/useReadData";
import useEventHandler from "../hooks/useEventHandler";
import { handleAddVendorBalance, handleDeleteVendorBalance, handleUpdateVendorBalance } from "../containers/vendor/vendorUtils"; // Update Redux utilities

const parentDivStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  alignItems: "center",
  width: "95%",
  margin: "auto"
}

export default function Vendors() { 
  const [query, setQuery] = useState("")
  const [showTransactions, setShowTransactions] = useState(false)
  const [instance, setInstance] = useState(null)
  const { business } = useSelector(state => state.login.activeUser)
  const mySocketId = useSelector(state => state?.login?.mySocketId)
  const token = useSelector(state => state.login.token)
  const url = `${constants.baseUrl}/vendors/get-business-vendors/${business?._id}` 
  const vendors = JSON.parse(JSON.stringify(useSelector(state => state.vendors?.vendors || []))) 
  const transactions = JSON.parse(JSON.stringify(useSelector(state => state.transactions.transactions))) 

  const dispatch = useDispatch()
  
  const { showRegister, update, toBeUpdatedCustomer: toBeUpdatedVendor, 
    handleUpdate, handleHide, handleShowRegister } = useRegisterForm() 

  const { loading, error } = useReadData(url, "vendor");
  console.log(vendors)

  const notify = (message) => toast(message, {
    autoClose: 2700,
    hideProgressBar: true,
    theme: "light",
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

  const handleSearchChange = (value) => {
    setQuery(value);
  };

  const calculateBalanceForVendor = (transactions) => { 
    let balance = 0;
    transactions.forEach(transaction => {
        balance += transaction.debit - transaction.credit;
    });
    return balance;
};

  const { handleEvent } = useEventHandler();

  useEffect(() => {
    const socket = io.connect('https://booktire-api.onrender.com');
    socket.on('vendorEvent', (data) => { 
      handleEvent(data, mySocketId, business?._id, "vendorEvent"); 
    });

    socket.on('transactionEvent', (data) => {
      handleTransactionEvent(data)
  });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleTransactionEvent = (data) => {

    const { socketId, businessId, transaction, eventType } = data;
    if (mySocketId == socketId) return
    if (business?._id !== businessId) return
    if (eventType === 'add') {
        alert("add")
        handleAddVendorBalance(dispatch, transactions, calculateBalanceForVendor, transaction); 
    } else if (eventType === 'delete') {
        handleDeleteVendorBalance(dispatch, transactions, calculateBalanceForVendor, transaction) 
    } else if (eventType === 'update') {
        handleUpdateVendorBalance(dispatch, transactions, calculateBalanceForVendor, transaction); 
    }

};


  return (
    <div style={parentDivStyle}>

      {!showTransactions && <TitleComponent title="Vendors" // Update title
        btnName="Create Vendors" onClick={handleShowRegister} />}

      {!showTransactions && <CustomRibbon query={query}
        setQuery={handleSearchChange} />}

      {!showTransactions && <Table
        data={handler(vendors)} columns={columns} // Update variable name
        name="Vendor" // Update name
        state={loading ? "loading.." : error ? error : "no data to display"}
        onUpdate={(data) => {
          handleUpdate(data)
        }}

        onSeeTransactions={(data) => {
          setInstance(data)
          setShowTransactions(true)
        }}

        onDelete={(data) => {
          deleteFunction(false,"Vendor Deletion", 
            data.name,
            `${constants.baseUrl}/vendors/close-vendor-statement/${data?._id}`, 
            token,
            () => { dispatch(deleteVendor(data)) }) 
        }} 

        onClickRow={(data) => {
          setInstance(data)
          setShowTransactions(true)
        }}
        
        />}

      {showRegister && <Register
        instance={toBeUpdatedVendor} // Update variable name
        update={update}
        name="Vendor"
        fields={fields}
        url="vendors"
        business={business?._id}
        hideModal={() => { handleHide() }}
        store={(data) => {
          dispatch(addVendor(data?.vendor)) 
          notify("Vendor created successfully") 
        }}
        onUpdate={
          (data) => {
            dispatch(updateVendor({ 
              _id: data?.vendor?._id,
              updatedVendor: data?.vendor
            }));
            notify("Vendor updated successfully") // Update message
          }
        } />}

      {showTransactions && <Transactions
        instance={instance}
        client= "vendor"
        url={`${constants.baseUrl}/transactions/get-vendor-transactions/${instance?._id}`} // Update URL
        hideTransactions={() => setShowTransactions(false)} />}

      <ToastContainer />

    </div>
  )
}
