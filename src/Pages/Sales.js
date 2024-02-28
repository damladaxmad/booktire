import React, { useState } from 'react';
import ItemsForm from '../containers/sales/ItemsForm';
import Selectors from '../containers/sales/Selectors';
import axios from 'axios';
import { constants } from '../Helpers/constantsFile';
import { useSelector } from 'react-redux';
import useReadData from '../hooks/useReadData';
import { Typography } from '@material-ui/core';
import SalesReport from '../containers/sales/SaleReport';
import moment from 'moment';

const Sales = () => {
  const [disabled, setDisabled] = useState(false);
  const [saleType, setSaleType] = useState('cash');
  const [customer, setCustomer] = useState('');
  const today = new Date()
  const [date, setDate] = useState(moment(today).format("YYYY-MM-DD"));
  const [currentTab, setCurrentTab] = useState(0); // Track current tab index
  const token = useSelector(state => state?.login?.token);
  const { business, name } = useSelector(state => state.login.activeUser);
  const urlProduct = `${constants.baseUrl}/products/get-business-products/${business?._id}`;
  const urlCustomer = `${constants.baseUrl}/customers/get-business-customers/${business?._id}`;

  useReadData(urlProduct, 'product');
  useReadData(urlCustomer, 'customer');

  const handleTabChange = (tabIndex) => {
    setCurrentTab(tabIndex);
  };

  const createSale = (data) => {
    axios.post(`${constants.baseUrl}/sales`, data, {
      headers: {
        authorization: token
      }
    }).then((res) => {
      setDisabled(false);
      alert("Successfully created sale!");
    }).catch((err) => {
      setDisabled(false);
      alert(err.response?.data?.message);
    });
  };

  const handleAddProduct = ({ products, discount, total }) => {
    setDisabled(true);

    console.log('Submitted data:', { products, discount, total });
    products?.map(product => {
      console.log(product.salePrice);
    });
    const transformedData = {
      products: products.map(product => ({
        refProduct: product?.product?._id,
        name: product.product.name,
        category: product.product.category,
        unitPrice: product.product.unitPrice,
        quantity: product.quantity,
        salePrice: product.salePrice
      })),
      discount: discount,
      paymentType: saleType,
      business: business?._id,
      customer: customer?._id,
      date: date,
      user: name
    };

    createSale(transformedData);
  };

  const handleFinish = () => {
    if (!date) {
      alert('Please select a date before finishing.');
      return;
    }
    handleAddProduct();
  };

  return (
    <div style={{ width: "95%", margin: "auto" }}>
      <div style={{
        display: 'flex',
        marginBottom: '20px',
        gap: "10px"
      }}>
        <div
          onClick={() => handleTabChange(0)}
          style={{
            padding: '5px 0px',
            width: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 0 ? constants.pColor : 'transparent',
            color: currentTab === 0 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
           <Typography>Form </Typography>
        </div>
        <div
          onClick={() => handleTabChange(1)}
          style={{
           padding: '5px 0px',
            width: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 1 ? constants.pColor : 'transparent',
            color: currentTab === 1 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          Report
        </div>
      </div>
      <div style={{
        width: "100%", margin: "auto", background: "white", borderRadius: "10px",
        padding: "30px", display: "flex", flexDirection: "column"
      }}>
        {currentTab === 0 && (
          <>
            <Selectors
              saleType={saleType}
              setSaleType={setSaleType}
              customer={customer}
              setCustomer={setCustomer}
              date={date}
              setDate={setDate}
            />
            <ItemsForm handleAddProduct={handleAddProduct} handleFinish={handleFinish}
              disabled={disabled} />
          </>
        )}
        {currentTab === 1 && (
          <SalesReport />
        )}
      </div>
    </div>
  );
};

export default Sales;
