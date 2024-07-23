import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Select from 'react-select';

const PurchaseSelectors = ({ purchaseType, setPurchaseType, vendor, setVendor, date, setDate, setRefNumber }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const vendors = useSelector(state => state?.vendors.vendors);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setDate(e.target.value);
  };

  const handleVendorSelect = (selectedOption) => {
    setVendor(selectedOption?.value);
  };

  const purchaseTypeOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'invoice', label: 'Invoice' }
  ];

  const vendorOptions = vendors.map(vendor => ({
    value: vendor,
    label: vendor.name
  }));

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <Select
        placeholder='Select purchase type'
        styles={{
          control: (styles) => ({
            ...styles,
            border: "1px solid lightGrey",
            height: "36px",
            borderRadius: "5px",
            width: "100px"
          })
        }}
        value={purchaseTypeOptions.find(option => option.value === purchaseType)}
        options={purchaseTypeOptions}
        onChange={(selectedOption) => setPurchaseType(selectedOption.value)}
      />

      <Select
        placeholder='Select vendor'
        styles={{
          control: (styles) => ({
            ...styles,
            border: "1px solid lightGrey",
            height: "36px",
            borderRadius: "5px",
            width: "183px"
          })
        }}
        value={vendor ? { value: vendor, label: vendor.name } : null}
        options={vendorOptions}
        onChange={handleVendorSelect}
        isDisabled={purchaseType === "cash"}
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
          border: "1px solid lightGrey"
        }}
        value={moment(selectedDate).format("YYYY-MM-DD")}
        onChange={handleDateChange}
      />

      <input
        type="text"
        style={{
          width: "150px",
          height: "36px",
          padding: "10px",
          fontSize: "14px",
          borderRadius: "5px",
          background: "white",
          border: "1px solid lightGrey"
        }}
        placeholder='Invoice no.'
        onChange={(e) => setRefNumber(e.target.value)}
      />

    </div>
  );
};

export default PurchaseSelectors;
