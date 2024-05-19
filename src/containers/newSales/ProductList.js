import { Typography } from '@mui/material';
import React, { useState } from 'react';
import { MdProductionQuantityLimits } from 'react-icons/md';

const ProductList = ({ addProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const products = [
    { id: 1, name: 'Samsung Galaxy', quantity: 2, price: 10 },
    { id: 2, name: 'iPhone 12 Pro', quantity: 1, price: 15 },
    { id: 3, name: 'Product 2', quantity: 1, price: 110.50 },
    { id: 4, name: 'Product 2', quantity: 1, price: 110.50 },
    // Add more products here
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (product) => {
    addProduct(product);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div style = {{width: "65%",}}>
       
      <input 
        type="text" 
        placeholder="Search products..." 
        style={{
            width: "200px",
            height: "35px",
            fontSize: "14px",
            borderRadius: "5px",
            background: "white",
            padding: "10px",
            border: "1px solid lightGrey",
        }}
        value={searchQuery} 
        onChange={handleSearchChange} 
      />
      <div style = {{display: "flex", gap: "20px", marginTop: "20px", width: "100%",
        flexWrap: "wrap"
      }}>
        {filteredProducts.map((product) => (
         <ProductCard key={product.id} product = {product} handleProductClick = {handleProductClick}/>
        ))}
      </div>
    </div>
  );
};


function ProductCard ({product, handleProductClick}) {
    return (
        <div 
        
        style = {{background:"white", borderRadius: "10px", padding: "15px",
                  display: "flex", flexDirection: "column", gap: "10px", cursor: "pointer",
                width: "30%"        }}
        onClick={() => handleProductClick(product)}
      >
        <div style = {{display: "flex", gap: "5px", flexDirection: "row",
            justifyContent: "space-between", alignItems: "center"
        }}>
            <MdProductionQuantityLimits style = {{color: "#6A03B6", fontSize: "50px"}}/>
        <div style = {{display: "flex", gap: "5px", flexDirection: "column"}}>
            <div style = {{display: "flex",
                background: "#E9E9E9",  borderRadius: "5px", padding: "5px 10px",
                border: "1px solid #B8B8B8"
            }}>
            <Typography> QTY: {product.quantity} </Typography>
            </div>
            
            <div style = {{display: "flex",
                background: "#E9E9E9",  borderRadius: "5px", padding: "5px 10px", 
                border: "1px solid #B8B8B8"
            }}>
            <Typography> ${product.price} </Typography>
            </div>
        </div>
        </div>

        <div style = {{display: "flex", alignItems: "center", justifyContent: "center",
            background: "#3E3E3E", color: "white", borderRadius: "5px", padding: "5px"
        }}>
        <Typography> {product.name} </Typography>
        </div>
    
      </div>
    )
}


export default ProductList;
