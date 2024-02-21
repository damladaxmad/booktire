import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AutoComplete } from 'primereact/autocomplete';
import CustomButton from '../../reusables/CustomButton';
import { constants } from '../../Helpers/constantsFile';
import { MdAdd, MdDelete } from 'react-icons/md';
import { Typography } from '@material-ui/core';

const ItemsForm = ({ handleAddProduct, handleFinish }) => {
  const initialProductState = { products: '', quantity: '', salePrice: '', subtotal: 0 };
  const headers = ["Name", "Qty", "Price", "Amount"];

  const [products, setProducts] = useState([initialProductState]);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const sliceProducts = useSelector(state => state?.products.products);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    const newTotal = products.reduce((acc, curr) => acc + (isNaN(curr.subtotal) ? 0 : curr.subtotal), 0);
    setTotal(newTotal - discount);
  }, [products, discount]);

  const searchCustomers = (event) => {
    const query = event.query;
    const filteredCustomers = sliceProducts?.filter(customer =>
      customer.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCustomers(filteredCustomers);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedProducts = [...products];
    updatedProducts[index][name] = value;

    if (name === 'quantity' || name === 'salePrice') { // Updated 'price' to 'salePrice'
      const quantity = parseFloat(updatedProducts[index].quantity);
      const salePrice = parseFloat(updatedProducts[index].salePrice); // Updated 'price' to 'salePrice'
      updatedProducts[index].subtotal = isNaN(quantity) || isNaN(salePrice) ? 0 : quantity * salePrice; // Updated 'price' to 'salePrice'
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

    const isAnyFieldEmpty = products.some(product => !product.customer || !product.quantity || !product.salePrice);
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
    <div style={{ width: "100%", }}>
      <form onSubmit={handleSubmit}>
        {/* <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "space-between" }}>
          {headers?.map(header => <p style={{ width: "20%" }}>{header}</p>)}
        </div> */}
        <div style={{
          display: "flex", flexDirection: "column", gap: "10px",
          margin: "20px 0px", width: "70%"
        }}>
          {products.map((product, index) => (
            <div key={index}
              style={{
                display: "flex", width: "100%", gap: "20px",
              }}>
              <AutoComplete
                placeholder='Select customer'
                style={{ border: "1px solid lightGrey", height: "36px", borderRadius: "5px" }}
                value={product.customer}
                suggestions={filteredCustomers}
                completeMethod={searchCustomers}
                field="name"
                onChange={(e) => handleInputChange(index, { target: { name: 'customer', value: e.value } })}
                onSelect={(e) => handleInputChange(index, { target: { name: 'customer', value: e.value } })}
              // dropdown
              />
              <input
                style={{ width: "100px", border: "1px solid lightGrey", borderRadius: "5px", padding: "5px 10px" }}
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={(event) => handleInputChange(index, event)}
                placeholder="quantity"
              />
              <input
                style={{ width: "100px", border: "1px solid lightGrey", borderRadius: "5px", padding: "5px 10px" }}
                type="number"
                name="salePrice"
                value={product?.salePrice}
                onChange={(event) => handleInputChange(index, event)}
                placeholder="price"
              />
              <p style={{
                margin: "0px", display: "flex", alignItems: "center",
                width: "100px", border: "1px solid lightGrey", padding: "5px 10px",
                fontWeight: "bold", borderRadius: "5px"
              }}> {`$${product?.subtotal}`}</p>

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "10px", border: "1px solid lightGrey", borderRadius: "50%",
                cursor: "pointer", background: constants?.backdropColor
              }}
                onClick={() => handleRemoveItem(index)}>
                <MdDelete style={{ color: constants?.sColor, fontSize: "16px" }}
                />
              </div>
            </div>
          ))}
        </div>

        <CustomButton
          text="Add item"
          bgColor="black"
          height="30px" fontSize="12px"
          onClick={handleAddItem}
          startIcon={<MdAdd
            style={{
              color: "white",
            }}
          />} />


        <div style={{
          marginTop: "15px", width: "100%",
          display: "flex", alignItems: "flex-end", flexDirection: "column"
        }}>
          <div>
            <Typography> Discount:</Typography>
            <input
              style={{ width: "120px", border: "1px solid lightGrey", borderRadius: "5px", padding: "7px 10px" }}
              type="number"
              name="price"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value))}
            />
          </div>


          <div style={{
            display: "flex", flexDirection: "column", gap: "0px",
            alignItems: "flex-end", marginTop: "15px"
          }}>
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

export default ItemsForm;
