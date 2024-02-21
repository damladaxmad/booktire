import React, { useState } from 'react';
import ItemsForm from '../containers/sales/ItemsForm';
import Selectors from '../containers/sales/Selectors';
import axios from 'axios';
import { constants } from '../Helpers/constantsFile';
import { useSelector } from 'react-redux';

const Sales = () => {
  const [saleType, setSaleType] = useState('cash');
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState('');
  const token = useSelector(state => state?.login?.token)

  
const data = {
  products: [
      {
          "name": "Iphone 12 Pro Max", 
          "refProduct": "65cb2955d728425e0f1ee7ac",
          "unitPrice": 100,
          "category": "Apple Phones", 
          "quantity": 1,
          "salePrice": 150
      }
  ],
  discount: 10, 
  paymentType: "invoice",
  business: "65cb22c6d728425e0f1ee777", 
  customer: "65cb2367d728425e0f1ee77a", 
  user: "Damlad Axmad" 
}
  
  const createSale = (data) => {
    alert("Sale called")
    axios.post(`${constants.baseUrl}/sales`, data,
    {
      headers: {
        "authorization": token
      }
    }).then((res) => {
      alert("Sucessfully created sale!")
    }).catch((err) => {
      alert(err.response?.data?.message);
    });
  }
  const handleAddProduct = ({ products, discount, total }) => {
    // Handle the submission logic here, e.g., sending the data to backend
    console.log('Submitted data:', { products, discount, total });
    products?.map(product => {
      console.log(product.customer.name)
      console.log(product.salePrice)
    })
    const transformedData = {
      products: products.map(product => ({
        refProduct: product?.customer?._id,
        name: product.customer.name,
        category: product.customer.category,
        unitPrice: product.customer.unitPrice,
        quantity: product.quantity,
        salePrice: product.salePrice
      })),
      discount: discount,
      paymentType: "invoice",
      business: "65cb22c6d728425e0f1ee777", 
      customer: "65cb2367d728425e0f1ee77a", 
      user: "Damlad Axmad" 
    };
    
    createSale(transformedData);
  };

  const handleFinish = () => {
    if (!date) {
      alert('Please select a date before finishing.');
      return;
    }
    createSale(data)
    handleAddProduct();
  };

  return (
    <div style={{width: "95%", margin: "auto"}}>

      <div style={{width: "100%", margin: "auto", background: "white", borderRadius: "10px",
    padding: "30px"}}>

      <Selectors
        saleType={saleType}
        setSaleType={setSaleType}
        customer={customer}
        setCustomer={setCustomer}
        date={date}
        setDate={setDate}
      />
      {/* Pass handleAddProduct and handleFinish functions to ItemsForm */}
      <ItemsForm handleAddProduct={handleAddProduct} handleFinish={handleFinish} />
      </div>
    </div>
  );
};

export default Sales;

const data = {
  products: [
      {
          "name": "Iphone 12 Pro Max", // get it from the product
          "refProduct": "65cb2955d728425e0f1ee7ac", // get it from the product
          "unitPrice": 100, // get it from the product
          "category": "Apple Phones", // get it from the product
          "quantity": 1,  //given
          "salePrice": 150  // given
      }
  ],
  discount: 10, // given
  paymentType: "invoice", // get it from selectors
  business: "65cb22c6d728425e0f1ee777", // hard coded
  customer: "65cb2367d728425e0f1ee77a", // get it from selectors
  user: "Damlad Axmad" // hard coded
}