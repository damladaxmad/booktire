import React, { useState } from 'react';
import ProductList from './ProductList';
import ItemsList from './ItemsList';
import CheckoutModal from './CheckoutModal';

const NewSales = ({handleAddProduct}) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  console.log(selectedProducts)

  const subtotal = selectedProducts.reduce((acc, product) => acc + product.salePrice * product.qty, 0);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
      <ProductList addProduct={addProduct} />
      <ItemsList 
        selectedProducts={selectedProducts} 
        updateProductQty={updateProductQty}
        handlePayment={handlePayment}
        removeProduct={removeProduct}
      />
      {isModalOpen && (
        <CheckoutModal 
          selectedProducts={selectedProducts}
          subtotal={subtotal}
          onClose={closeModal}
          onFinishPayment = { (data) => handleAddProduct({
            products: selectedProducts,
            saleType: data.saleType,
            discount: data?.discount
          })}
        />
      )}
    </div>
  );
};

export default NewSales;
