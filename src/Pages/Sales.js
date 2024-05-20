import React, { useState } from 'react';
import ItemsForm from '../containers/sales/ItemsForm';
import Selectors from '../containers/sales/Selectors';
import axios from 'axios';
import { constants } from '../Helpers/constantsFile';
import { useDispatch, useSelector } from 'react-redux';
import useReadData from '../hooks/useReadData';
import { Typography } from '@material-ui/core';
import SalesReport from '../containers/sales/SaleReport';
import moment from 'moment';
import SalesTable from '../containers/sales/SalesTable';
import { setProductDataFetched, setProducts } from '../containers/products/productSlice';
import { setCustomerDataFetched, setCustomers, updateCustomerSocketBalance } from '../containers/customer/customerSlice';
import NewSales from '../containers/newSales/NewSales';

const Sales = () => {
  const [disabled, setDisabled] = useState(false);
  const [currentTab, setCurrentTab] = useState(0); // Track current tab index
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling modal visibility
  const token = useSelector(state => state?.login?.token);
  const { business, name } = useSelector(state => state.login.activeUser);
  const urlCustomer = `${constants.baseUrl}/customers/get-business-customers/${business?._id}`;
  const urlProduct = `${constants.baseUrl}/products/get-business-products/${business?._id}`;

  const dispatch = useDispatch();

  useReadData(
    urlProduct,
    setProducts,
    setProductDataFetched,
    state => state.products.isProductsDataFetched,
    "products"
  );
  useReadData(
    urlCustomer,
    setCustomers,
    setCustomerDataFetched,
    state => state.customers.isCustomerDataFetched,
    "customers"
  );

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
      setProductDataFetched(false);
      let sale = res?.data?.data?.createdSale[0];
      dispatch(updateCustomerSocketBalance({ _id: sale?.customer, transaction: sale?.total }));
      alert("Successfully created sale!");
      setIsModalOpen(false); // Close modal when sale is created successfully
    }).catch((err) => {
      setDisabled(false);
      alert(err.response?.data?.message);
    });
  };

  const handleAddProduct = ({ products, discount, total, date, saleType, customer }) => {
    setDisabled(true);
    console.log(saleType, products);
    console.log('Submitted data:', { products, discount, total });
    products?.map(product => {
      console.log(product.salePrice);
    });
    const transformedData = {
      products: products.map(product => ({
        refProduct: product?._id,
        name: product.name,
        category: product.category,
        unitPrice: product.unitPrice,
        quantity: product.qty,
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

  return (
    <div style={{ width: "95%", margin: "auto" }}>
      <div style={{ display: 'flex', marginBottom: '20px', gap: "10px" }}>
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
        <div
          onClick={() => handleTabChange(2)}
          style={{
            padding: '5px 0px',
            width: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 2 ? constants.pColor : 'transparent',
            color: currentTab === 2 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          Sales
        </div>
      </div>
      <div style={{ width: "100%", margin: "auto", borderRadius: "10px", padding: "0px", display: "flex", flexDirection: "column" }}>
        {currentTab === 0 && (
          <NewSales 
            handleAddProduct={handleAddProduct}
            setIsModalOpen={setIsModalOpen} // Pass the function to control modal visibility
          />
        )}
        {currentTab === 1 && <SalesReport />}
        {currentTab === 2 && <SalesTable />}
      </div>
    </div>
  );
};

export default Sales;
