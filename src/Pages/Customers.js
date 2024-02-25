import { useEffect, useState } from "react";
import Table from "../utils/Table";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, deleteCustomer, updateCustomer, updateCustomerSocketBalance } from "../containers/customer/customerSlice";
import { constants } from "../Helpers/constantsFile";
import Register from "../utils/Register";
import { deleteFunction } from "../funcrions/deleteStuff";
import useRegisterForm from "../hooks/useRegister";
import CustomRibbon from "../reusables/CustomRibbon";
import { fields } from "../containers/customer/customerModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Transactions from "../containers/transaction/Transactions";
import TitleComponent from "../reusables/TitleComponent.";
import io from 'socket.io-client';
import useReadData from "../hooks/useReadData";
import useEventHandler from "../hooks/useEventHandler";
import { handleAddCustomerBalance, handleDeleteCustomerBalance, handleUpdateCustomerBalance } from "../containers/customer/customerUtils";

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
  const [showTransactions, setShowTransactions] = useState(false)
  const [instance, setInstance] = useState(null)
  const { business } = useSelector(state => state.login.activeUser)
  const mySocketId = useSelector(state => state?.login?.mySocketId)
  const token = useSelector(state => state.login.token)
  const url = `${constants.baseUrl}/customers/get-business-customers/${business?._id}`
  const customers = JSON.parse(JSON.stringify(useSelector(state => state.customers?.customers || [])))
  const transactions = JSON.parse(JSON.stringify(useSelector(state => state.transactions.transactions)))

  const dispatch = useDispatch()
  
  const { showRegister, update, toBeUpdatedCustomer,
    handleUpdate, handleHide, handleShowRegister } = useRegisterForm()

  const { loading, error } = useReadData(url, "customer");

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
          .filter((instance) => {
            if (instance?.status == "closed") return
            if (!instance?.type || instance?.type == "deynle")
              return instance.balance >= 0 || instance.balance <= 0;
          })
      } else {
        return data?.filter(
          (instance) => {
            if (instance?.status == "closed") return
            if (!instance?.type || instance.type == "deynle")
              return (instance?.name.toLowerCase().includes(query.toLocaleLowerCase()) ||
              instance.phone.toLowerCase().includes(query?.toLocaleLowerCase()))
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

  const calculateBalanceForCustomer = (transactions) => {
    let balance = 0;
    transactions.forEach(transaction => {
        balance += transaction.debit - transaction.credit;
    });
    return balance;
};

  const { handleEvent } = useEventHandler();

  useEffect(() => {
    const socket = io.connect('https://booktire-api.onrender.com');
    socket.on('customerEvent', (data) => {
      handleEvent(data, mySocketId, business?._id, "customerEvent");
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
      let newTransaction = transaction?.debit == 0 ? -transaction?.credit : transaction?.debit
      dispatch(updateCustomerSocketBalance({_id: transaction?.customer, transaction: newTransaction}))
    } else if (eventType === 'delete') {
      let newTransaction = transaction?.debit == 0 ? transaction?.credit : -transaction?.debit
      dispatch(updateCustomerSocketBalance({_id: transaction?.customer, transaction: newTransaction}))
    } else if (eventType === 'update') {
      console.log(transaction)
    }

};


  return (
    <div style={parentDivStyle}>

      {!showTransactions && <TitleComponent title="Customers"
        btnName="Create Customers" onClick={handleShowRegister} />}

      {!showTransactions && <CustomRibbon query={query}
        setQuery={handleSearchChange} />}

      {!showTransactions && <Table
        data={handler(customers)} columns={columns}
        name="Customer"
        state={loading ? "loading.." : error ? error : "no data to display"}
        onUpdate={(data) => {
          handleUpdate(data)
        }}

        onSeeTransactions={(data) => {
          setInstance(data)
          setShowTransactions(true)
        }}

        onDelete={(data) => {
          deleteFunction(false, "Customer Deletion",
            data.name,
            `${constants.baseUrl}/customers/close-customer-statement/${data?._id}`,
            token,
            () => { dispatch(deleteCustomer(data)) })
        }} 
        
        onClickRow={(data) => {
          setInstance(data)
          setShowTransactions(true)
        }}
        />}

      {showRegister && <Register
        instance={toBeUpdatedCustomer}
        update={update}
        name="Customer"
        fields={fields}
        url="customers"
        business={business?._id}
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
        instance={instance}
        client= "customer"
        url={`${constants.baseUrl}/transactions/get-customer-transactions/${instance?._id}`}
        hideTransactions={() => setShowTransactions(false)} />}

      <ToastContainer />

    </div>
  )
}