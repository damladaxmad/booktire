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
import NewServices from '../containers/newServices/NewServices';
import { setServiceTypeDataFetched, setServiceTypes } from '../containers/serviceType/serviceTypeSlice';
import ServiceTable from '../containers/sales/ServiceTable';
import SalesMen from '../containers/sales/SalesMen';

const Sales = () => {
  const [disabled, setDisabled] = useState(false);
  const [currentTab, setCurrentTab] = useState(0); // Track current tab index
  const token = useSelector(state => state?.login?.token);
  const [editedSale, setEditedSale] = useState()
  const { business, name } = useSelector(state => state.login.activeUser);
  const urlCustomer = `${constants.baseUrl}/customers/get-business-customers/${business?._id}`;
  const urlProduct = `${constants.baseUrl}/products/get-business-products/${business?._id}`;
  const urlServiceType = `${constants.baseUrl}/service-types/get-business-service-types/${business?._id}`;

  const dispatch = useDispatch();

  const {loading} =useReadData(
    urlProduct,
    setProducts,
    setProductDataFetched,
    state => state.products.isProductsDataFetched,
    "products"
  );
  const { loading: serviceLoading } = useReadData(
    urlServiceType,
    setServiceTypes,
    setServiceTypeDataFetched,
    state => state.serviceTypes.isServiceTypeDataFetched,
    "serviceTypes"
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

  const handleEditSale = (data) => {
    setCurrentTab(0)
    setEditedSale(data)
  }


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
          onClick={() => handleTabChange(3)}
          style={{
            padding: '5px 0px',
            width: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 3 ? constants.pColor : 'transparent',
            color: currentTab === 3 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          Services
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
        <div
          onClick={() => handleTabChange(4)}
          style={{
            padding: '5px 0px',
            width: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 4 ? constants.pColor : 'transparent',
            color: currentTab === 4 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          Services
        </div>
        <div
          onClick={() => handleTabChange(5)}
          style={{
            padding: '5px 0px',
            width: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 5 ? constants.pColor : 'transparent',
            color: currentTab === 5 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          Commissions
        </div>
      </div>
      <div style={{ width: "100%", margin: "auto", borderRadius: "10px", padding: "0px", display: "flex", flexDirection: "column" }}>
        {currentTab === 0 && (
          <NewSales loading = {loading} editedSale = {editedSale} setEditedSale={() => {
            setEditedSale()
          }}
            // handleAddProduct={handleAddProduct}
          />
        )}
        {currentTab === 2 && <SalesTable editSale = {(editedSale)=> handleEditSale(editedSale)}/>}
        {currentTab === 3 && <NewServices loading = {serviceLoading} />}
        {currentTab === 4 && <ServiceTable />}
        {currentTab === 5 && <SalesMen />}
      </div>
    </div>
  );
};

export default Sales;
