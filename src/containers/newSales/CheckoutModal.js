import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { Typography, IconButton, TextField, Select, MenuItem, Button, Divider } from '@material-ui/core';
import MaterialTable from 'material-table';
import CustomButton from '../../reusables/CustomButton';
import { constants } from '../../Helpers/constantsFile';
import moment from 'moment';

const CheckoutModal = ({ selectedProducts, subtotal, onClose, onFinishPayment }) => {
  const [paymentType, setPaymentType] = useState('cash');
  const [discount, setDiscount] = useState("");
  const [total, setTotal] = useState(subtotal);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    // setDate(e.target.value)
  };

  useEffect(() => {
    if (discount == "") setTotal(subtotal)
    setTotal(subtotal - discount);
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
              { title: 'Items', field: 'name', width: "45%"},
              { title: 'QTY', field: 'qty', type: 'numeric' },
              { title: 'Price', field: 'salePrice', type: 'currency' },
              { title: 'Subtotal', field: 'subtotal', type: 'currency' }
            ]}
            data={selectedProducts.map(product => ({
              name: product.name,
              qty: product.qty,
              salePrice: product.salePrice,
              subtotal: product.salePrice * product.qty
            }))}
            title="Items"
            options={{
              search: false,
              paging: false,
              toolbar: false,
              headerStyle: { fontWeight: "bold" }
            }}
            style={{ boxShadow: "none", width: "100%" }}
          />
        </div>

        <div style = {{width: "1px", background: "lightGrey", height: "100%", marginRight: "20px"}}></div>
        <div style={{ width: '45%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>Checkout</Typography>
              <IconButton onClick={onClose}>
                <MdClose style={{ fontSize: "20px", color: constants.pColor }} />
              </IconButton>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Select
                fullWidth
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="invoice">Invoice</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
              </Select>
            </div>
            {paymentType === 'invoice' && (
              <div style={{ marginBottom: '20px' }}>
                <Select fullWidth defaultValue="Jaamac Nuur" variant="outlined">
                  <MenuItem value="Jaamac Nuur">Jaamac Nuur</MenuItem>
                  <MenuItem value="Another Customer">Another Customer</MenuItem>
                </Select>
              </div>
            )}
            <div style={{ marginBottom: '20px',display:"flex", flexDirection: "row", width: "100%",
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
                style={{ width: "47%", border: "1px solid lightGrey", borderRadius: "5px", 
                padding: "7px 10px", height: "40px" }}
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
              text="FINISH PAYMENT"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => onFinishPayment({discount: discount, saleType: paymentType, date: selectedDate})}
              style={{ width: "100%", fontSize: "14px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
