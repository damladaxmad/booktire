import React, { useRef } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import POSPrintableComponent from './POSPrintableComponent';
import moment from 'moment';
import { constants } from '../../Helpers/constantsFile';

const PrintSaleModal = ({ open, onClose, business, user, data }) => {
  const printRef = useRef();

  const { discount, date, products } = data;
  const subtotal = products?.reduce((acc, product) => acc + product.salePrice * product.qty, 0);

  // Ensure discount is a number or default to 0
  let discountValue = 0;
  if (typeof discount === 'number' && !isNaN(discount)) {
    discountValue = parseFloat(discount);
  }

  // Calculate total considering the discount
  const total = subtotal - discountValue;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Do you want to print?
          </Typography>
          <Button
            style={{ background: constants.pColor }}
            variant="contained"
            color="secondary"
            onClick={() => {
              onClose();
              handlePrint();
            }}
            sx={{ mt: 2, mr: 2 }}
          >
            Print Sale
          </Button>
          <Button variant="contained" style={{ background: "white", color: "black" }} onClick={onClose} sx={{ mt: 2 }}>
            Cancel
          </Button>
        </Box>
      </Modal>
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          <POSPrintableComponent
            subtotal={subtotal}
            date={moment(date).format("YYYY-MM-DD")}
            discount={discountValue}
            total={total}
            reportTitle="Sales Receipt"
            columns={[
              { title: "Items", field: "name" },
              { title: "Qty", field: "qty" },
              { title: "Price", field: "salePrice" },
              { title: "Subtotal", field: "total" }
            ]}
            data={products.map(product => ({
              name: product.name,
              qty: product.qty,
              salePrice: `$${product.salePrice}`,
              total: `$${product.qty * product.salePrice}`
            }))}
            business={business}
            user={user}
          />
        </div>
      </div>
    </>
  );
};

export default PrintSaleModal;
