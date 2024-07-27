import React, { useState } from 'react';
import PurchaseSelectors from '../containers/puchase/PurchaseSelectors';
import PurchaseItemsForm from '../containers/puchase/PurchaseItemsForm';
import axios from 'axios';
import { constants } from '../Helpers/constantsFile';
import { useDispatch, useSelector } from 'react-redux';
import useReadData from '../hooks/useReadData';
import { Typography } from '@material-ui/core';
import { setProductDataFetched, setProducts, updateProductQuantity, updateProductUnitPriceAndSalePrice } from '../containers/products/productSlice';
import { setVendorDataFetched, setVendors, updateVendorSocketBalance } from '../containers/vendor/vendorSlice';
import moment from 'moment';
import PurchasesTable from '../containers/puchase/PurchaseTable';

const Purchases = () => {
  const [disabled, setDisabled] = useState(false)
  const [purchaseType, setPurchaseType] = useState('cash');
  const [vendor, setVendor] = useState('');
  const today = new Date()
  const [date, setDate] = useState(moment(today).format("YYYY-MM-DD"));
  const [refNumber, setRefNumber] = useState("")
  const [currentTab, setCurrentTab] = useState(0); // Track current tab index
  const token = useSelector(state => state?.login?.token)
  const { business, username: name } = useSelector(state => state.login.activeUser)
  const urlProduct = `${constants.baseUrl}/products/get-business-products/${business?._id}`
  const urlVendor = `${constants.baseUrl}/vendors/get-business-vendors/${business?._id}`

  const dispatch = useDispatch()

  useReadData(
    urlProduct,
    setProducts,
    setProductDataFetched,
    state => state.products.isProducsDataFetched,
    "products"
  );

  useReadData(
    urlVendor,
    setVendors,
    setVendorDataFetched,
    state => state.vendors.isVendorDataFetched,
    "vendors"
  );

  const handleTabChange = (tabIndex) => {
    setCurrentTab(tabIndex);
  };

  const createPurchase = (data) => {
    axios.post(`${constants.baseUrl}/purchases`, data, {
      headers: {
        "authorization": token
      }
    }).then((res) => {
      setDisabled(false)
      let purchase = res?.data?.data?.createdPurchase[0]
      console.log(purchase.vendor, purchase.total)
      dispatch(updateVendorSocketBalance({_id: purchase?.vendor, transaction: purchase?.total}))
      purchase.products.forEach(product => {
        dispatch(updateProductQuantity({ productId: product.refProduct, quantity: product.quantity, type: "purchase" }));
        dispatch(updateProductUnitPriceAndSalePrice({ productId: product.refProduct, unitPrice: product.unitPrice, 
          salePrice: product.salePrice,  type: "purchase" }));
      });
      alert("Sucessfully created purchase!")
      setProductDataFetched(false)
    }).catch((err) => {
      setDisabled(false)
      console.log(data)
      alert(err.response?.data?.message);
    });
  };

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
        quantity: parseInt(product.quantity)
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
    <div style={{ width: "95%", margin: "auto" }}>
      <div style={{ display: 'flex', marginBottom: '20px', gap: "10px" }}>
        <div
          onClick={() => handleTabChange(0)}
          style={{
            padding: '5px 0px', width: "80px", display: "flex", alignItems: "center", justifyContent: "center",
            marginRight: '10px', cursor: 'pointer',
            backgroundColor: currentTab === 0 ? constants.pColor : 'transparent',
            color: currentTab === 0 ? 'white' : 'black', borderRadius: '50px', border: `1px solid ${constants.pColor}`
          }}>
          <Typography>Form </Typography>
        </div>
        <div
          onClick={() => handleTabChange(1)}
          style={{
            padding: '5px 0px', width: "80px", display: "flex", alignItems: "center", justifyContent: "center",
            marginRight: '10px', cursor: 'pointer',
            backgroundColor: currentTab === 1 ? constants.pColor : 'transparent',
            color: currentTab === 1 ? 'white' : 'black', borderRadius: '50px', border: `1px solid ${constants.pColor}`
          }}>
          Table
        </div>
      </div>
      <div style={{
        width: "100%", margin: "auto", background: "white", borderRadius: "10px",
        padding: "30px", display: "flex", flexDirection: "column"
      }}>
        {currentTab === 0 && (
          <>
            <PurchaseSelectors
              purchaseType={purchaseType}
              setPurchaseType={setPurchaseType}
              vendor={vendor}
              setVendor={setVendor}
              date={date}
              setDate={setDate}
              refNumber={refNumber}
              setRefNumber={setRefNumber}
            />
            <PurchaseItemsForm handleAddProduct={handleAddProduct} handleFinish={handleFinish}
              disabled={disabled} />
          </>
        )}
        {currentTab === 1 && (
          <PurchasesTable />
        )}
      </div>
    </div>
  );
};

export default Purchases;
