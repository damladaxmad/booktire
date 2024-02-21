import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AutoComplete } from 'primereact/autocomplete';
import moment from 'moment';

const Selectors = ({ saleType, setSaleType, customer, setCustomer, date, setDate }) => {
  const [value, setValue] = useState('');
  const customers = useSelector(state => state?.customers.customers)
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const currentDate = new Date()

  // Function to filter customers based on input
  const searchCustomers = (event) => {
    const query = event.query;
    const filteredCustomers = customers.filter(customer =>
      customer.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCustomers(filteredCustomers);
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>

      <select value={saleType} style={{
        width: "100px", borderRadius: "5px", padding: "10px",
        height: "2.5rem", border: "1px solid lightGrey"
      }}
        onChange={(e) => setSaleType(e.target.value)}>
        <option value="cash">Cash</option>
        <option value="invoice">Invoice</option>
      </select>

        <AutoComplete
          placeholder='Select customer'
          style={{ border: "1px solid lightGrey", height: "36px", borderRadius: "5px" }}
          value={value}
          suggestions={filteredCustomers}
          completeMethod={searchCustomers}
          onChange={(e) => setValue(e.value)}
          field="name" // Specify which property to display in the dropdown
          // dropdown
          disabled={saleType == "cash"} 
        />

      <input
        type="date"
        style={{
          width: "180px",
          height: "36px",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          background: "white",
          border: "1px solid lightGrey",
      
        }}
        defaultValue={moment(currentDate).format("DD-MM-YYYY")}
        // onChange={(e) => props.date(e.target.value)}
      />

      <input
        type="text"
        style={{
          width: "180px",
          height: "36px",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          background: "white",
          border: "1px solid lightGrey",
      
        }}
        placeholder='Enter invoice'
        // onChange={(e) => props.date(e.target.value)}
      />
      
      {/* <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /> */}
    </div>
  );
};

export default Selectors;
