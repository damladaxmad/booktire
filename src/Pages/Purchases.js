import React, { useState } from 'react';
import ItemsForm from '../containers/sales/ItemsForm';
import Selectors from '../containers/sales/Selectors';
import axios from 'axios';
import { constants } from '../Helpers/constantsFile';
import { useSelector } from 'react-redux';
import useReadData from '../hooks/useReadData';
import PurchaseSelectors from '../containers/puchase/PurchaseSelectors';
import moment from 'moment';
import PurchaseItemsForm from '../containers/puchase/PurchaseItemsForm';
import { setProductDataFetched, setProducts } from '../containers/products/productSlice';
import { setVendorDataFetched, setVendors } from '../containers/vendor/vendorSlice';

const Purchases = () => {
  const [disabled, setDisabled] = useState(false)
  const [purchaseType, setPurchaseType] = useState('cash');
  const [vendor, setVendor] = useState('');
  const [date, setDate] = useState(new Date());
  const [refNumber, setRefNumber] = useState("")
  const token = useSelector(state => state?.login?.token)
  const { business, name } = useSelector(state => state.login.activeUser)
  const urlProduct = `${constants.baseUrl}/products/get-business-products/${business?._id}`
  const urlVendor = `${constants.baseUrl}/vendors/get-business-vendors/${business?._id}`

  useReadData(
    urlProduct,
    setProducts,
    setProductDataFetched,
    state => state.products.isProductsDataFetched,
    "products"
);
useReadData(
  urlVendor,
  setVendors,
  setVendorDataFetched,
  state => state.vendors.isVendorDataFetched,
  "vendors"
);

  const createPurchase = (data) => {
    axios.post(`${constants.baseUrl}/purchases`, data,
    {
      headers: {
        "authorization": token
      }
    }).then((res) => {
      setDisabled(false)
      alert("Sucessfully created purchase!")
    }).catch((err) => {
      setDisabled(false)
      console.log(data)
      alert(err.response?.data?.message);
    });
  }
  const handleAddProduct = ({ products, discount, total }) => {
    setDisabled(true)

    console.log('Submitted data:', { products, discount, total });
  
    const transformedData = {
      products: products.map(product => ({
        refProduct: product?.product?._id,
        name: product.product.name,
        category: "Phones",
        unitPrice: product.unitPrice,
        salePrice: product.salePrice,
        quantity: product.quantity
      })),
      discount: discount,
      paymentType: purchaseType,
      business: business?._id, 
      vendor: vendor?._id, 
      date: date,
      refNumber: refNumber,
      user: name
    };
    
    createPurchase(transformedData);
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

      <PurchaseSelectors
        purchaseType={purchaseType}
        setPurchaseType={setPurchaseType}
        vendor={vendor}
        setVendor={setVendor}
        date={date}
        setDate={setDate}
        refNumber = {refNumber}
        setRefNumber = {setRefNumber}
      />

      <PurchaseItemsForm handleAddProduct={handleAddProduct} handleFinish={handleFinish} 
      disabled = {disabled}/>
      </div>
    </div>
  );
};

export default Purchases;