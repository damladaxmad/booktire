// In NewSales.js

import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
import ItemsList from './ItemsList';
import CheckoutModal from './CheckoutModal';
import axios from 'axios';
import { constants } from '../../Helpers/constantsFile';
import { setProductDataFetched, updateProductQuantity } from '../products/productSlice';
import { updateCustomerSocketBalance } from '../customer/customerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import PrintSaleModal from './PrintSaleModal';
import moment from 'moment';

const NewSales = ({ loading, editedSale, setEditedSale }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const token = useSelector(state => state?.login?.token);
  const { business, username } = useSelector(state => state.login.activeUser);
  const [data, setData] = useState();
  const [group, setGroup] = useState("")

  console.log(editedSale)

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

  useEffect(() => {
    if (editedSale) {
      const updatedProducts = editedSale.products.map(product => ({
        ...product,
        qty: product.quantity,
        _id: product?.refProduct
      }));
      setSelectedProducts(updatedProducts);
    }
  }, [editedSale]);

  const addGroup = (group) => {
    setGroup((prevGroup) => prevGroup + ` ${group}`);
    console.log(group)
  }
  const addProduct = (product, group) => {
    setSelectedProducts((prevProducts) => {
      const existingProduct = prevProducts.find(p => p._id === product._id);
      if (existingProduct) {
        return prevProducts.map(p =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prevProducts, { ...product, qty: product?.qty }];
    });
  };

  const updateProductQty = (productId, qty) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map(p =>
        p._id === productId ? { ...p, qty } : p
      )
    );
  };

  const updateProductDetails = (productId, qty, salePrice) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map(p =>
        p._id === productId ? { ...p, qty, salePrice } : p
      )
    );
  };

  const removeProduct = (productId) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter(p => p._id !== productId)
    );
  };

  const handlePayment = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFinishPayment = (data) => {
    console.log(data?.user)
    setData(data);
    handleAddProduct({
      products: selectedProducts,
      saleType: data.saleType,
      discount: data?.discount || 0,
      customer: data?.customer,
      date: data.date,
      user: data.user || username,
      note: data?.note
    });
  };

  const subtotal = selectedProducts.reduce((acc, product) => acc + product.salePrice * product.qty, 0);

  const dispatch = useDispatch();

  const createSale = (data) => {
    const url = editedSale ? `${constants.baseUrl}/sales/${editedSale?._id}` : `${constants.baseUrl}/sales`;
    const method = editedSale ? 'patch' : 'post';

    axios({
      method: method,
      url: url,
      data: data,
      headers: {
        authorization: token
      }
    }).then((res) => {
      setDisabled(false);
      setProductDataFetched(false);
      let sale;
      if (res?.data?.data?.createdSale && res.data.data.createdSale.length > 0) {
        sale = res.data.data.createdSale[0]; // Assign the first item from createdSale
      } else if (res?.data?.data?.sale) {
        sale = res.data.data?.sale; // Assign updatedSale
      }
    
      const balanceChange = editedSale ? sale?.total - editedSale?.total : sale?.total;
      dispatch(updateCustomerSocketBalance({ _id: sale?.customer, transaction: balanceChange }));

      if (res?.data?.data?.createdSale && res.data.data.createdSale.length > 0) {
        selectedProducts.forEach(product => {
          dispatch(updateProductQuantity({ productId: product._id, quantity: product.qty, type: "sale" }));
        });
      } else if (res?.data?.data?.sale) {
        selectedProducts.forEach(product => {
          console.log(product)
          dispatch(updateProductQuantity({ productId: product._id, quantity: product.qty - product?.quantity, type: "sale" }));
        });
      }
     
      notify(res?.data?.data?.createdSale ? "Sale Created" : "Sale Updated");
      setIsPrintModalOpen(true);
      setIsModalOpen(false);
      setSelectedProducts([]);
      setEditedSale()
    }).catch((err) => {
      console.log(err)
      setDisabled(false);
      alert(err.response?.data?.message);
    });
  };


  const handleAddProduct = ({ products, discount, total, date, note, saleType, customer, user }) => {
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
      date: moment(date).format("YYYY-MM-DD"),
      user: user,
      note: note,
      group: editedSale ? editedSale?.group : group
    };

    createSale(transformedData);
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
      <ProductList addProduct={addProduct} addGroup={addGroup} loading={loading} />
      <ItemsList
        selectedProducts={selectedProducts}
        updateProductQty={updateProductQty}
        updateProductDetails={updateProductDetails}
        handlePayment={handlePayment}
        removeProduct={removeProduct}
      />
      {isModalOpen && (
        <CheckoutModal
          editedSale = {editedSale}
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
          data={data}
          business={business}
          user={username}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default NewSales;
