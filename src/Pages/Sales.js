import React, { useState } from 'react';
import ItemsForm from '../containers/sales/ItemsForm';
import Selectors from '../containers/sales/Selectors';
import axios from 'axios';
import { constants } from '../Helpers/constantsFile';
import { useSelector } from 'react-redux';
import useReadData from '../hooks/useReadData';

const Sales = () => {
  const [disabled, setDisabled] = useState(false)
  const [saleType, setSaleType] = useState('cash');
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState('');
  const token = useSelector(state => state?.login?.token)
  const { business, name } = useSelector(state => state.login.activeUser)
  const urlProduct = `${constants.baseUrl}/products/get-business-products/${business?._id}`
  const urlCustomer = `${constants.baseUrl}/customers/get-business-customers/${business?._id}`

  useReadData(urlProduct, "product");
  useReadData(urlCustomer, "customer");
  
  const createSale = (data) => {
    axios.post(`${constants.baseUrl}/sales`, data,
    {
      headers: {
        "authorization": token
      }
    }).then((res) => {
      setDisabled(false)
      alert("Sucessfully created sale!")
    }).catch((err) => {
      setDisabled(false)
      alert(err.response?.data?.message);
    });
  }
  const handleAddProduct = ({ products, discount, total }) => {
    setDisabled(true)

    console.log('Submitted data:', { products, discount, total });
    products?.map(product => {
      console.log(product.salePrice)
    })
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
    <div style={{width: "95%", margin: "auto"}}>

      <div style={{width: "100%", margin: "auto", background: "white", borderRadius: "10px",
    padding: "30px", display: "flex", flexDirection: "column"}}>

      <Selectors
        saleType={saleType}
        setSaleType={setSaleType}
        customer={customer}
        setCustomer={setCustomer}
        date={date}
        setDate={setDate}
      />

      <ItemsForm handleAddProduct={handleAddProduct} handleFinish={handleFinish} 
      disabled = {disabled}/>
      </div>
    </div>
  );
};

export default Sales;