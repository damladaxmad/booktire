import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AutoComplete } from 'primereact/autocomplete';
import moment from 'moment';

const PurchaseSelectors = ({ purchaseType, setPurchaseType, vendor, setVendor, date, setDate, setRefNumber }) => {
  const [value, setValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const vendors = useSelector(state => state?.vendors.vendors)
  const [filteredVendors, setFilteredVendors] = useState([]);


  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setDate(e.target.value)
  };

  const searchVendors = (event) => {
    const query = event.query;
    const filteredVendors = vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(query?.toLowerCase())
    );
    setFilteredVendors(filteredVendors);
  };

  
  const handleVendorSelect = (event) => {
    setVendor(event.value);
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>

      <select value={purchaseType} style={{
        width: "100px", borderRadius: "5px", padding: "10px",
        height: "2.5rem", border: "1px solid lightGrey"
      }}
        onChange={(e) => setPurchaseType(e.target.value)}>
        <option value="cash">Cash</option>
        <option value="invoice">Invoice</option>
      </select>

        <AutoComplete
          placeholder='Select vendor'
          style={{ border: "1px solid lightGrey", height: "36px", borderRadius: "5px",
        width: "183px" }}
          value={value}
          suggestions={filteredVendors}
          completeMethod={searchVendors}
          onChange={(e) => setValue(e.value)}
          onSelect={handleVendorSelect}
          field="name" // Specify which property to display in the dropdown
          dropdown
          disabled={purchaseType == "cash"} 
        />

      <input
        type="date"
        style={{
          width: "140px",
          height: "36px",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          background: "white",
          border: "1px solid lightGrey",
      
        }}
        value={moment(selectedDate).format("YYYY-MM-DD")}
        onChange={handleDateChange}
      />

      <input
        type="text"
        style={{
          width: "120px",
          height: "36px",
          padding: "10px",
          fontSize: "14px",
          borderRadius: "5px",
          background: "white",
          border: "1px solid lightGrey",
      
        }}
        placeholder='Invoice no.'
        onChange={(e)=> setRefNumber(e.target.value)}
      />
      
    </div>
  );
};

export default PurchaseSelectors;
