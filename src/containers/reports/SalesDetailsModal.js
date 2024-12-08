import React, { useRef } from 'react';
import { Typography, Modal, Backdrop, Fade, Box, Button } from "@material-ui/core";
import { useReactToPrint } from 'react-to-print';
import CustomButton from "../../reusables/CustomButton";
import POSPrintableComponent from '../newSales/POSPrintableComponent'; // Ensure the path is correct
import moment from "moment";
import { constants } from "../../Helpers/constantsFile";

const SalesDetailsModal = ({ open, handleClose, sale, business, user }) => {
    const printRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const subtotal = sale?.products?.reduce((acc, product) => acc + product.salePrice * product.quantity, 0);
    const discount = sale?.discount || 0;
    const total = subtotal - discount;

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box style={{ padding: "20px", backgroundColor: "white", borderRadius: "8px", outline: "none", width: "400px", margin: "auto", marginTop: "10%" }}>
                        <div style = {{display: "flex", flexDirection: "column"}}>
                        <Typography style={{
                            fontWeight: "bold", fontSize: "18px"
                        }}>Transaction Details</Typography>
                        <Typography style={{
                          
                        }}>{sale?.note}</Typography>
                        </div>
                        {sale ? (
                            sale?.products?.map((product, index) => (
                                <Box key={index} display="flex" justifyContent="space-between" my={2} style={{ borderBottom: "1px solid lightgray", paddingBottom: "5px" }}>
                                    <Typography style={{ flex: 1.5 }}>{product.name}</Typography>
                                    <Typography style={{ flex: 1, textAlign: "right" }}>{product.quantity}</Typography>
                                    <Typography style={{ flex: 1, textAlign: "right" }}>{sale?.purchaseNumber ? `$${product?.unitPrice?.toFixed(2)}` : 
                                    `$${product?.salePrice?.toFixed(2)}`}</Typography>
                                    <Typography style={{ flex: 1, textAlign: "right" }}>${product.subtotal?.toFixed(2)}</Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography>No details available.</Typography>
                        )}
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button style={{ background: constants.pColor, color: "white" }}
                                variant="contained" onClick={()=> {
                                    handlePrint()
                                    // handleClose()
                                    }} >
                                Print
                            </Button>
                            <Button variant="contained" onClick={handleClose} style={{ marginLeft: "10px" }}>
                                Close
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <div style={{ display: 'none' }}>
                <div ref={printRef}>
                    <POSPrintableComponent
                        subtotal={subtotal}
                        date={moment(sale?.date).format("YYYY-MM-DD")}
                        discount={discount}
                        total={total}
                        reportTitle="Sales Receipt"
                        columns={[
                            { title: "Items", field: "name" },
                            { title: "Qty", field: "quantity" },
                            { title: "Price", field: "salePrice" },
                            { title: "Subtotal", field: "subtotal" }
                        ]}
                        data={sale?.products?.map(product => ({
                            name: product.name,
                            quantity: product.quantity,
                            salePrice: `$${product.salePrice}`,
                            subtotal: `$${product.subtotal}`
                        }))}
                        business={business}
                        user={user}
                    />
                </div>
            </div>
        </>
    );
};

export default SalesDetailsModal;
