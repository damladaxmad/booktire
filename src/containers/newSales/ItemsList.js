// ItemsList.js
import React from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Box from '@material-ui/core/Box';
import { MdKeyboardArrowDown } from "react-icons/md";
import CustomButton from "../../reusables/CustomButton.js"

const ItemsList = ({ selectedProducts, updateProductQty, handlePayment, removeProduct }) => {
  const handleQtyChange = (productId, qty) => {
    if (qty > 0) {
      updateProductQty(productId, qty);
    }
  };

  const handleRemoveProduct = (productId) => {
    removeProduct(productId);
  };

  const subtotal = selectedProducts.reduce((acc, product) => acc + product.salePrice * product.qty, 0);

  return (
    <div 
      style={{ 
        background: "white", 
        padding: "10px", 
        width: "35%", 
        height: "420px",
        borderRadius: "10px",
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
      <div style={{ flexGrow: 1 }}>
        {selectedProducts?.length < 1 && <p style = {{color: "grey", textAlign: "center", 
        marginTop: "20px"}}> Please select some products...</p>}
        {selectedProducts.map((product, index) => (
          <React.Fragment key={product.id}>
            <div className="selected-product" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: "4px" }}>
              <MdKeyboardArrowDown style={{ flex: 0.5, fontSize: "18px", cursor: "pointer" }}/>
              <Typography variant="body1" style={{ flex: 2 }}>{product.name}</Typography>
              <Box display="flex" alignItems="center" style={{ flex: 1, justifyContent: 'center' }}>
                <IconButton size="small" onClick={() => handleQtyChange(product.id, product.qty - 1)}>
                  <RemoveIcon style={{ background: "black", borderRadius:"50px", color: "white", fontSize: "16px" }} />
                </IconButton>
                <Typography variant="body1" align="center" style={{ margin: '0 8px' }}>{product.qty}</Typography>
                <IconButton size="small" onClick={() => handleQtyChange(product.id, product.qty + 1)}>
                  <AddIcon style={{ background: "black", borderRadius:"50px", color: "white", fontSize: "16px" }} />
                </IconButton>
              </Box>
              <Typography variant="body1" style={{ flex: 1, textAlign: 'center' }}>${product.salePrice * product.qty}</Typography>
              <IconButton size="small" onClick={() => handleRemoveProduct(product.id)} style={{ flex: 0 }}>
                <DeleteIcon />
              </IconButton>
            </div>
            {index < selectedProducts.length && <Divider style={{ marginBottom: "10px" }} />}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 'auto', marginBottom: "5px" }}>
        <div style = {{display: "flex", flexDirection: "row", justifyContent: "space-between",
            marginBottom: "10px"
        }}>
        <Typography variant="body1">TOTAL:</Typography>
        <Typography variant="body" style = {{fontWeight: "bold"}}> ${subtotal.toFixed(2)}</Typography>
        </div>

        <CustomButton text="Payment" style={{ width: "100%", height: "35px", fontSize: "15px" }} onClick={handlePayment} />
      </div>
    </div>
  );
};

export default ItemsList;
