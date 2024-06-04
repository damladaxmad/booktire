import { Typography } from '@mui/material';
import React, { useState } from 'react';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { useSelector } from 'react-redux';
import Select from "react-select";
import { constants } from '../../Helpers/constantsFile';
import { setCategories, setCategoryDataFetched } from '../category/categorySlice';
import useReadData from '../../hooks/useReadData';
import { setServiceTypeDataFetched, setServiceTypes } from '../serviceType/serviceTypeSlice';

const ProductList = ({ addProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const products = useSelector(state => state?.serviceTypes.serviceTypes);
  const [category, setCategory] = useState(null);
  const { business } = useSelector(state => state.login.activeUser)
  const categories = JSON.parse(JSON.stringify(useSelector(state => state.serviceTypes?.serviceTypes || [])));
  const url2 = `${constants.baseUrl}/service-types/get-business-service-types/${business?._id}`

  useReadData(
    url2,
    setServiceTypes,
    setServiceTypeDataFetched,
    state => state.serviceTypes.isServiceTypesDataFetched,
    "serviceTypes"
  );
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (product) => {
    addProduct(product);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategorySelect = (selectedOption) => {
    if (selectedOption) {
      setCategory(selectedOption.value);
    } else {
      setCategory(null); // Clear the category state
    }
  };

  return (
    <div style={{ width: "63%" }}>
      <div style={{ display: "flex", gap: "20px", width: "98%" }}>
        <input
          type="text"
          placeholder="Search products..."
          style={{
            width: "47%",
            height: "40px",
            fontSize: "14px",
            borderRadius: "5px",
            background: "white",
            padding: "10px",
            border: "1px solid lightGrey",
          }}
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <Select
          placeholder='Select category'
          styles={{
            control: (styles, { isDisabled }) => ({
              ...styles,
              border: "1px solid lightGrey",
              height: "40px",
              borderRadius: "5px",
              width: "280px",
              minHeight: "28px",
              ...(isDisabled && { cursor: "not-allowed" }),
            }),
            menu: (provided, state) => ({
              ...provided,
              zIndex: 9999
            }),
            option: (provided, state) => ({
              ...provided,
              color: state.isSelected ? "black" : "inherit",
              backgroundColor: state.isSelected ? constants.pColor + "1A" : "inherit",
              "&:hover": {
                backgroundColor: constants.pColor + "33",
              }
            }),
            singleValue: (provided, state) => ({
              ...provided,
              color: "black",
            }),
            input: (provided, state) => ({
              ...provided,
              color: "black",
              "&:focus": {
                borderColor: constants.pColor,
                boxShadow: `0 0 0 1px ${constants.pColor}`,
              }
            }),
          }}
          value={category ? { value: category, label: category.name } : null}
          options={categories.map(category => ({ value: category, label: category?.name }))}
          onChange={handleCategorySelect}
          isClearable={true}
        />
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px", width: "100%",
       flexWrap: "wrap", height: "62vh", overflowY: "scroll",}}>
        {filteredProducts.map((product) => {
          if (category && product.category !== category?.categoryName) return null;
          return <ProductCard key={product.id} product={product} handleProductClick={handleProductClick} />
        })}
      </div>
    </div>
  );
};

function ProductCard({ product, handleProductClick }) {
 
  return (
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        cursor: "pointer",
        height: "100%",
        width: "30%"
      }}
      onClick={() => handleProductClick(product)}
    >
      <div style={{ display: "flex", gap: "5px", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <MdProductionQuantityLimits style={{ color: "#6A03B6", fontSize: "50px" }} />
        <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
          {/* <div style={{
            display: "flex",
            background: "#E9E9E9",
            borderRadius: "5px",
            padding: "5px 10px",
            border: "1px solid #B8B8B8"
          }}>
            <Typography> Price: </Typography>
          </div> */}
          <div style={{
            display: "flex",
            background: "#E9E9E9",
            borderRadius: "5px",
            padding: "5px 10px",
            border: "1px solid #B8B8B8"
          }}>
            <Typography> Price: $2{product.price} </Typography>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#3E3E3E", color: "white", borderRadius: "5px", padding: "5px" }}>
        <Typography> {product.name.substring(0, 15)}
          {product.name.length <= 16 ? null : "..."} </Typography>
      </div>
    </div>
  );
}

export default ProductList;
