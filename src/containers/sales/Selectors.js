import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Select from 'react-select';

const Selectors = ({ saleType, setSaleType, customer, setCustomer, date, setDate }) => {
  const [value, setValue] = useState(''); // Define value state
  const customers = useSelector(state => state?.customers.customers);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setDate(e.target.value)
  };

  const searchCustomers = () => {
    return customers
      .filter(customer =>
        customer?.name?.toLowerCase().includes(value.toLowerCase())
      )
      .map(customer => ({ value: customer, label: customer?.name }));
  };

  const handleCustomerSelect = (selectedOption) => {
    if (selectedOption) {
      setValue(selectedOption?.value?.name || ''); // Set the value state
      setCustomer(selectedOption.value);
    } else {
      setValue(''); // Clear the value state
      setCustomer(null); // Clear the customer state
    }
  };

  const saleTypeOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'invoice', label: 'Invoice' }
  ];

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <Select
        value={saleTypeOptions.find(option => option.value === saleType)}
        options={saleTypeOptions}
        onChange={(selectedOption) => setSaleType(selectedOption.value)}
      />

      <Select
        placeholder='Select customer'
        styles={{
          control: (styles, { isDisabled }) => ({
            ...styles,
            border: "1px solid lightGrey",
            height: "36px",
            borderRadius: "5px",
            width: "183px",
            minHeight: "28px",
            ...(isDisabled && { cursor: "not-allowed" }),
          })
        }}
        value={customer ? { value: customer, label: customer.name } : null}
        options={searchCustomers()}
        onChange={handleCustomerSelect}
        isClearable={true} // Make the Select clearable
        isDisabled={saleType === "cash"}
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
    </div>
  );
};

export default Selectors;
