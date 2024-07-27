import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { useSelector } from 'react-redux';
import Select from "react-select";
import { constants } from '../../Helpers/constantsFile';
import { setCategories, setCategoryDataFetched } from '../category/categorySlice';
import useReadData from '../../hooks/useReadData';
import PreItemsPopup from './PreItemsPopup';
import PreGroupPopup from './PreGroupPopup';

const ProductList = ({ addProduct, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const products = useSelector(state => state?.products.products);
  const [category, setCategory] = useState(null);
  const [saleType, setSaleType] = useState("items");
  const { business } = useSelector(state => state.login.activeUser);
  const categories = JSON.parse(JSON.stringify(useSelector(state => state.categories?.categories || [])));
  const url2 = `${constants.baseUrl}/product-categories/get-business-product-categories/${business?._id}`;

  useReadData(
    url2,
    setCategories,
    setCategoryDataFetched,
    state => state.users.isCategoriesDataFetched,
    "categories"
  );

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isGroupOpen, setIsGroupOpen] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };
  const handleGroupClick = (product) => {
    setSelectedGroup(product);
    setIsGroupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };
  const handleGroupClose = () => {
    setIsGroupOpen(false);
    setSelectedGroup(null);
  };

  const handlePopupConfirm = (product) => {
    addProduct(product);
  };
  const handleGroupConfirm = (products, price) => {
    console.log(price)
    // Calculate the total salePrice of all products
    const totalSalePrice = products.reduce((sum, product) => sum + product.unitPrice, 0);
  
    // Calculate the adjustment to be made to each product's salePrice
    const adjustment = (price - totalSalePrice) / products.length;
  
    // Update each product with the new salePrice
    products?.forEach(element => {
      const newSalePrice = element.unitPrice + adjustment;
      console.log(newSalePrice)
      addProduct({...element, qty: 1, salePrice: newSalePrice});
    });
  };
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategorySelect = (selectedOption) => {
    if (selectedOption) {
      setCategory(selectedOption.value);
    } else {
      setCategory(null); 
    }
  };

  const [groupedProducts, setGroupedProducts] = useState([]);

  useEffect(() => {
    const groupByItemGroup = products.reduce((acc, product) => {
      if (product.itemGroup) { // Ensure the itemGroup is not undefined
        if (!acc[product.itemGroup]) {
          acc[product.itemGroup] = [];
        }
        acc[product.itemGroup].push(product);
      }
      return acc;
    }, {});
  
    const groupedArray = Object.keys(groupByItemGroup)
      .filter(itemGroup => groupByItemGroup[itemGroup].length > 0) // Remove empty groups
      .map(itemGroup => ({
        label: itemGroup,
        value: groupByItemGroup[itemGroup],
      }));
  
    setGroupedProducts(groupedArray);
  }, [products]);
  

  const saleTypeOptions = [
    { value: 'items', label: 'Items' },
    { value: 'group', label: 'Group' }
  ];

  console.log(groupedProducts)

  return (
    <div style={{ width: "63%" }}>
      <div style={{ display: "flex", gap: "20px", width: "98%" }}>
        <input
          type="text"
          placeholder="Search products..."
          style={{
            width: "36%",
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
          placeholder='Select Store'
          styles={{
            control: (styles, { isDisabled }) => ({
              ...styles,
              border: "1px solid lightGrey",
              height: "40px",
              borderRadius: "5px",
              width: "200px",
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
          value={category ? { value: category, label: category.categoryName } : null}
          options={categories.map(category => ({ value: category, label: category?.categoryName }))}
          onChange={handleCategorySelect}
          isClearable={true}
        />

        
<Select
  styles={{
    control: (styles, { isDisabled }) => ({
      ...styles,
      border: "1px solid lightGrey",
      height: "40px",
      borderRadius: "5px",
      width: "120px",
      minHeight: "28px",
      ...(isDisabled && { cursor: "not-allowed" }),
    }),
    menu: (provided, state) => ({
      ...provided,
      zIndex: 9999
    })}}
                value={saleTypeOptions.find(option => option.value === saleType)}
                options={saleTypeOptions}
                onChange={(selectedOption) => setSaleType(selectedOption.value)}
                // styles={{width: "100px"}}
              />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </div>
      ) : saleType == "group" ? (
        <div style={{ display: "flex", gap: "20px", marginTop: "20px", width: "100%", flexWrap: "wrap", maxHeight: "62vh", overflowY: "scroll"}}>
          {groupedProducts.map((product) => {
            return <GroupCard key={product.id} product={product} handleGroupClick={handleGroupClick} />
          })}
        </div>
      )
      : (
        <div style={{ display: "flex", gap: "20px", marginTop: "20px", width: "100%", flexWrap: "wrap", maxHeight: "62vh", overflowY: "scroll"}}>
          {filteredProducts.map((product) => {
            if (category && product.category !== category?.categoryName) return null;
            if (saleType == "group") return null;
            return <ProductCard key={product.id} product={product} handleProductClick={handleProductClick} />
          })}
        </div>
      ) }
      {(filteredProducts?.length < 1 && !loading)&& <p style = {{color: "grey", textAlign: "center", 
        marginTop: "20px"}}> No products here...</p>}
      
      {selectedProduct && (
        <PreItemsPopup
          product={selectedProduct}
          isOpen={isPopupOpen}
          onClose={handlePopupClose}
          onConfirm={handlePopupConfirm}
        />
      )}
      {selectedGroup && (
        <PreGroupPopup
          product={selectedGroup}
          isOpen={isGroupOpen}
          onClose={handleGroupClose}
          onConfirm={(products, price)=> {
            handleGroupConfirm(products, price)
          }}
        />
      )}
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
        width: "30%",
        maxHeight: "200px" // Set a consistent height
      }}
      onClick={() => handleProductClick(product)}
    >
      <div style={{ display: "flex", gap: "5px", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <MdProductionQuantityLimits style={{ color: "#6A03B6", fontSize: "50px" }} />
        <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
          <div style={{
            display: "flex",
            background: "#E9E9E9",
            borderRadius: "5px",
            padding: "5px 10px",
            border: "1px solid #B8B8B8"
          }}>
            <Typography> QTY: {product.quantity} </Typography>
          </div>
          <div style={{
            display: "flex",
            background: "#E9E9E9",
            borderRadius: "5px",
            padding: "5px 10px",
            border: "1px solid #B8B8B8"
          }}>
            <Typography> ${product.salePrice} </Typography>
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
function GroupCard({ product, handleGroupClick }) {
  console.log(product)
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
        width: "30%",
        maxHeight: "200px" 
      }}
      onClick={() => handleGroupClick(product)}
    >
      <div style={{ display: "flex", gap: "5px", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <MdProductionQuantityLimits style={{ color: "#6A03B6", fontSize: "50px" }} />
        <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
          <div style={{
            display: "flex",
            background: "#E9E9E9",
            borderRadius: "5px",
            padding: "5px 10px",
            border: "1px solid #B8B8B8"
          }}>
            <Typography> QTY: 1 </Typography>
          </div>
          <div style={{
            display: "flex",
            background: "#E9E9E9",
            borderRadius: "5px",
            padding: "5px 10px",
            border: "1px solid #B8B8B8"
          }}>
            <Typography> $0 </Typography>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#3E3E3E", color: "white", borderRadius: "5px", padding: "5px" }}>
        <Typography> {product.label?.substring(0, 15)}
          {product.label?.length <= 16 ? null : "..."} </Typography>
      </div>
    </div>
  );
}

export default ProductList;
