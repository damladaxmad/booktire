// EditProductModal.js
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@material-ui/core';
import { constants } from '../../Helpers/constantsFile';

const EditProductModal = ({ open, handleClose, product, updateProductDetails }) => {
  const [qty, setQty] = useState(product.qty);
  const [salePrice, setSalePrice] = useState(product.salePrice);

  const handleSave = () => {
    if (!qty || (!salePrice && salePrice != 0)) return alert("Fadlan Geli Tirada iyo Qiimaha")
    updateProductDetails(product._id, qty, salePrice);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          padding: '20px',
        }}
      >
        <Typography variant="h6" style = {{fontWeight: "bold"}} gutterBottom>
          Edit Product <span style = {{fontSize: "14PX", fontWeight: "normal"}}>({product.name}) </span>
        </Typography>
        <TextField
          fullWidth
          variant='outlined'
          margin="normal"
          label="Tirada"
          type="number"
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value, 10))}
        />
        <TextField
          fullWidth
          margin="normal"
          variant='outlined'
          label="Qiimaha"
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(parseFloat(e.target.value))}
        />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={handleClose} style={{ marginRight: '10px' }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave} 
          style = {{background: constants?.pColor}}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProductModal;
