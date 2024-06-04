import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { Typography, IconButton, } from '@material-ui/core';
import MaterialTable from 'material-table';
import CustomButton from '../../reusables/CustomButton';
import { constants } from '../../Helpers/constantsFile';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Select from "react-select"

const CheckoutModal = ({ selectedProducts, subtotal, onClose, onFinishPayment, disabled }) => {
  const [discount, setDiscount] = useState("");
  const [total, setTotal] = useState(subtotal);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [value, setValue] = useState(''); // Define value state
  const customers = useSelector(state => state?.customers.customers);
  const [saleType, setSaleType] = useState("cash")
  const [customer, setCustomer] = useState()

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
      setCustomer(''); // Clear the value state
    }
  };

  const saleTypeOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'invoice', label: 'Invoice' }
  ];

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  useEffect(() => {
    const discountValue = parseFloat(discount);
    const calculatedTotal = isNaN(discountValue) ? subtotal : subtotal - discountValue;
    setTotal(calculatedTotal);
  }, [discount, subtotal]);

  return (
    <div style={{
      position: 'fixed',
      top: "50px",
      left: "100px",
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        width: '60%',
        maxWidth: '800px',
        height: '70%',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between"
      }}>
        <div style={{ width: '55%', marginRight: '20px' }}>
          <MaterialTable
            columns={[
              { title: 'Items', field: 'name', cellStyle: { whiteSpace: 'nowrap' }},
              { title: 'QTY', field: 'qty', type: 'numeric' },
              { title: 'Price', field: 'salePrice', type: 'currency' },
              { title: 'Subtotal', field: 'subtotal', type: 'currency' }
            ]}
            data={selectedProducts.map(product => ({
              name: product.name,
              qty: product.qty,
              salePrice: product.salePrice,
              subtotal: product.price * product.qty
            }))}
            title="Items"
            options={{
              search: false,
              paging: false,
              toolbar: false,
              tableLayout: 'fixed',
              headerStyle: { fontWeight: "bold" }
            }}
            style={{ boxShadow: "none", width: "100%" }}
          />
        </div>

        <div style={{ width: "1px", background: "lightGrey", height: "100%", marginRight: "20px" }}></div>
        <div style={{ width: '45%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>Checkout</Typography>
              <IconButton onClick={onClose}>
                <MdClose style={{ fontSize: "20px", color: constants.pColor }} />
              </IconButton>
            </div>

            <div style = {{width: "100%", display: "flex", gap: "10px", flexDirection: "column",
              marginBottom: "15px"
            }}>
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
                  width: "100%",
                  minHeight: "28px",
                  ...(isDisabled && { cursor: "not-allowed" }),
                })
              }}
              value={customer ? { value: customer, label: customer.name } : null}
              // options={searchCustomers()}
          options={customers.map(customer => ({ value: customer, label: customer?.name }))}
              onChange={handleCustomerSelect}
              isClearable={true} // Make the Select clearable
              isDisabled={saleType === "cash"}
            />
            </div>

            <div style={{
              marginBottom: '20px', display: "flex", flexDirection: "row", width: "100%",
              justifyContent: "space-between"
            }}>
              <input
                type="date"
                style={{
                  width: "47%",
                  height: "40px",
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
                style={{
                  width: "47%", border: "1px solid lightGrey", borderRadius: "5px",
                  padding: "7px 10px", height: "40px"
                }}
                type="number"
                placeholder='Discount'
                name="price"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value))}
              />

            </div>

          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Typography variant="body1">TOTAL:</Typography>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>${total.toFixed(2)}</Typography>
            </div>
            <CustomButton
              disabled={disabled}
              text="FINISH PAYMENT"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => onFinishPayment({ discount: discount, saleType: saleType, 
                date: selectedDate, customer: customer, products: selectedProducts })}
              style={{ width: "100%", fontSize: "14px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
