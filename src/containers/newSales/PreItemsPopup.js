import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@material-ui/core';
import { constants } from '../../Helpers/constantsFile';

const PreItemsPopup = ({ product, isOpen, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(product.salePrice);

  const handleConfirm = () => {
    onConfirm({ ...product, qty: quantity, salePrice: price });
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
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
        <Typography variant="h6" style={{ fontWeight: "bold" }} gutterBottom>
          {product.name}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          onKeyDown={handleKeyDown}
        />
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          onKeyDown={handleKeyDown}
        />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={onClose} style={{ marginRight: '10px' }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirm}
            style={{ background: constants?.pColor }}>
           ADD
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PreItemsPopup;
