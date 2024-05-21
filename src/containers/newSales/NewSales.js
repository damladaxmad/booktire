import React, { useState } from 'react';
import ProductList from './ProductList';
import ItemsList from './ItemsList';
import CheckoutModal from './CheckoutModal';
import axios from 'axios';
import { constants } from '../../Helpers/constantsFile';
import { setProductDataFetched } from '../products/productSlice';
import { updateCustomerSocketBalance } from '../customer/customerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import PrintSaleModal from './PrintSaleModal';

const NewSales = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const token = useSelector(state => state?.login?.token);
  const { business, name } = useSelector(state => state.login.activeUser);
  const [data, setData] = useState()

  const notify = (message) => toast(message, {
    autoClose: 2700,
    hideProgressBar: true,
    theme: "colored",
    position: "top-right",
    style: {
      backgroundColor: 'green',
      color: 'white'  
    }
  });

  const addProduct = (product) => {
    setSelectedProducts((prevProducts) => {
      const existingProduct = prevProducts.find(p => p.id === product.id);
      if (existingProduct) {
        return prevProducts.map(p => 
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prevProducts, { ...product, qty: 1 }];
    });
  };

  const updateProductQty = (productId, qty) => {
    setSelectedProducts((prevProducts) => 
      prevProducts.map(p => 
        p.id === productId ? { ...p, qty } : p
      )
    );
  };

  const updateProductDetails = (productId, qty, salePrice) => {
    setSelectedProducts((prevProducts) => 
      prevProducts.map(p => 
        p.id === productId ? { ...p, qty, salePrice } : p
      )
    );
  };

  const removeProduct = (productId) => {
    setSelectedProducts((prevProducts) => 
      prevProducts.filter(p => p.id !== productId)
    );
  };

  const handlePayment = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFinishPayment = (data) => {
    setData(data)
    handleAddProduct({
      products: selectedProducts,
      saleType: data.saleType,
      discount: data?.discount || 0,
      customer: data?.customer,
      date: data.date
    });
    setIsPrintModalOpen(true);
  };

  const subtotal = selectedProducts.reduce((acc, product) => acc + product.salePrice * product.qty, 0);

  const dispatch = useDispatch();

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
      notify("Sale created!");
      setIsModalOpen(false);
      setSelectedProducts([]);
    }).catch((err) => {
      setDisabled(false);
      alert(err.response?.data?.message);
    });
  };

  const handleAddProduct = ({ products, discount, total, date, saleType, customer }) => {
    setDisabled(true);
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
    <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
      <ProductList addProduct={addProduct} />
      <ItemsList 
        selectedProducts={selectedProducts} 
        updateProductQty={updateProductQty}
        updateProductDetails={updateProductDetails}
        handlePayment={handlePayment}
        removeProduct={removeProduct}
      />
      {isModalOpen && (
        <CheckoutModal 
          disabled={disabled}
          selectedProducts={selectedProducts}
          subtotal={subtotal}
          onClose={closeModal}
          onFinishPayment={handleFinishPayment}
        />
      )}
      {(isPrintModalOpen && !isModalOpen) && (
        <PrintSaleModal
          open={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          data = {data}
          business={business}
          user={name}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default NewSales;
