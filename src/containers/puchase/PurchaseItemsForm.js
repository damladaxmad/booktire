import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AutoComplete } from 'primereact/autocomplete';
import CustomButton from '../../reusables/CustomButton';
import { constants } from '../../Helpers/constantsFile';
import { MdAdd, MdDelete } from 'react-icons/md';
import { Typography } from '@material-ui/core';

const PurchaseItemsForm = ({ disabled, handleAddProduct, handleFinish }) => {
  const initialProductState = { product: '', quantity: '', unitPrice: '', salePrice: '', subtotal: 0 };
  const headers = ["Name", "Qty", "Unit Price", "Sale Price", "Amount"]; // Updated headers

  const [products, setProducts] = useState([initialProductState]);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const sliceProducts = useSelector(state => state?.products.products);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const newTotal = products.reduce((acc, curr) => acc + (isNaN(curr.subtotal) ? 0 : curr.subtotal), 0);
    setTotal(newTotal - discount);
  }, [products, discount]);

  const searchProducts = (event) => {
    const query = event.query;
    const filteredProducts = sliceProducts?.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedProducts = [...products];
    updatedProducts[index][name] = value;

    if (name === 'quantity' || name === 'unitPrice' || name === 'salePrice') { 
      const quantity = parseFloat(updatedProducts[index].quantity);
      const unitPrice = parseFloat(updatedProducts[index].unitPrice);
      const salePrice = parseFloat(updatedProducts[index].salePrice); // Updated: Parse salePrice
      updatedProducts[index].subtotal = isNaN(quantity) || isNaN(unitPrice) ? 0 : quantity * unitPrice;
    }

    setProducts(updatedProducts);
  };

  const handleAddItem = () => {
    setProducts([...products, { ...initialProductState }]);
  };

  const handleRemoveItem = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isAnyFieldEmpty = products.some(product => !product.product || !product.quantity || !product.unitPrice);
    if (isAnyFieldEmpty) {
      alert('Please fill in all fields before finishing.');
      return;
    }

    handleAddProduct({ products, discount, total });
    setProducts([initialProductState]);
    setDiscount(0);
    setTotal(0);
  };

  return (
    <div style={{ width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "20px 0px", width: "80%" }}>
          <div style={{ display: "flex", width: "100%", gap: "20px" }}>
            {headers.map((header, index) => (
              <Typography key={index} style={{ flex: index === 0 ? "1.2" : "0.73", color: "#999999" }}>{header}</Typography>
            ))}
            <Typography style={{ flex: "0.2", color: "#999999" }}>Action</Typography>
          </div>
          {products.map((product, index) => (
            <div key={index} style={{ display: "flex", width: "100%", gap: "20px" }}>
              <AutoComplete
                placeholder='Select product'
                style={{ flex: "2", minWidth: "0", border: "1px solid lightGrey", height: "36px", borderRadius: "5px" }}
                value={product.product}
                suggestions={filteredProducts}
                completeMethod={searchProducts}
                field="name"
                onChange={(e) => handleInputChange(index, { target: { name: 'product', value: e.value } })}
                onSelect={(e) => {
                  handleInputChange(index, { target: { name: 'quantity', value: 1 } });
                  handleInputChange(index, { target: { name: 'unitPrice', value: e.value.unitPrice } });
                  handleInputChange(index, { target: { name: 'salePrice', value: e.value.salePrice } });
                }}
                dropdown
              />
              <input
                style={{ flex: "1", minWidth: "0", width: "100px", border: "1px solid lightGrey", borderRadius: "5px", padding: "5px 10px" }}
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={(event) => handleInputChange(index, event)}
                placeholder="quantity"
              />
              <input
                style={{ flex: "1", minWidth: "0", width: "100px", border: "1px solid lightGrey", borderRadius: "5px", padding: "5px 10px" }}
                type="number"
                name="unitPrice"
                value={product.unitPrice}
                onChange={(event) => handleInputChange(index, event)}
                placeholder="unit price"
              />
              <input // New salePrice input field
                style={{ flex: "1", minWidth: "0", width: "100px", border: "1px solid lightGrey", borderRadius: "5px", padding: "5px 10px" }}
                type="number"
                name="salePrice"
                value={product.salePrice}
                onChange={(event) => handleInputChange(index, event)}
                placeholder="sale price"
              />
              <p style={{ flex: "1", minWidth: "0", width: "100px", margin: "0px", display: "flex", alignItems: "center", border: "1px solid lightGrey", padding: "5px 10px", fontWeight: "bold", borderRadius: "5px" }}> ${product?.subtotal}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", border: "1px solid lightGrey", borderRadius: "50%", cursor: "pointer", background: "white" }} onClick={() => handleRemoveItem(index)}>
                <MdDelete style={{ color: "black", fontSize: "16px" }} />
              </div>
            </div>
          ))}
        </div>
        <CustomButton
          text="Add item"
          bgColor="black"
          height="30px" fontSize="12px"
          onClick={handleAddItem}
          startIcon={<MdAdd style={{ color: "white" }} />} />
        <div style={{ marginTop: "15px", width: "100%", display: "flex", alignItems: "flex-end", flexDirection: "column" }}>
          <div>
            <Typography>Discount:</Typography>
            <input
              style={{ width: "120px", border: "1px solid lightGrey", borderRadius: "5px", padding: "7px 10px" }}
              type="number"
              name="price"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value))}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0px", alignItems: "flex-end", marginTop: "15px" }}>
            <Typography style={{ fontSize: "14px", color: "#6D6D6D" }}>TOTAL:</Typography>
            <Typography style={{ fontSize: "18px", fontWeight: "bold" }}>${total}</Typography>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "20px", marginTop: "15px" }}>
            <CustomButton
              text="Cancel"
              color="black"
              width="120px"
              bgColor="white"
              height="38px" fontSize="15px"
              onClick={() => {
                setProducts([initialProductState]);
                setDiscount(0);
                setTotal(0);
              }}
            />
            <CustomButton
              disabled={disabled}
              text="Finish"
              width="120px"
              bgColor={constants.pColor}
              height="38px" fontSize="15px"
              type="submit"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PurchaseItemsForm;
