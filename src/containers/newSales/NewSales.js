import React, { useState } from 'react';
import ProductList from './ProductList';
import ItemsList from './ItemsList';

const NewSales = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);

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
    // Handle payment logic here
    console.log('Payment clicked', selectedProducts);
  };

  return (
    <div style = {{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
      <ProductList addProduct={addProduct} />
      <ItemsList 
        selectedProducts={selectedProducts} 
        updateProductQty={updateProductQty}
        handlePayment={handlePayment}
        removeProduct={removeProduct}
      />
    </div>
  );
};

export default NewSales;
