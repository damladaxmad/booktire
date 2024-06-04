import React, { useRef } from 'react';
import { Typography, Modal, Backdrop, Fade, Box, Button } from "@material-ui/core";
import { useReactToPrint } from 'react-to-print';
import CustomButton from "../../reusables/CustomButton";
import POSPrintableComponent from '../newSales/POSPrintableComponent'; // Ensure the path is correct
import moment from "moment";
import { constants } from "../../Helpers/constantsFile";

const ServiceDetailsModal = ({ open, handleClose, service, business, user }) => {
    const printRef = useRef();
    console.log(service)

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const subtotal = service?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = service?.discount || 0;
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
                        <Typography variant="h6" gutterBottom style={{
                            fontWeight: "bold"
                        }}>Service Details</Typography>
                        {service ? (
                            service?.serviceItems?.map((item, index) => (
                                <Box key={index} display="flex" justifyContent="space-between" my={2} style={{ borderBottom: "1px solid lightgray", paddingBottom: "5px" }}>
                                    <Typography style={{ flex: 1.8 }}>{item.name}</Typography>
                                    <Typography style={{ flex: 1, textAlign: "right" }}>{item.quantity}</Typography>
                                    <Typography style={{ flex: 1, textAlign: "right" }}>${item.unitPrice}</Typography>
                                    <Typography style={{ flex: 1, textAlign: "right" }}>${item.subtotal}</Typography>
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
                        date={moment(service?.date).format("YYYY-MM-DD")}
                        discount={discount}
                        total={total}
                        reportTitle="Service Receipt"
                        columns={[
                            { title: "Items", field: "name" },
                            { title: "Qty", field: "quantity" },
                            { title: "Price", field: "price" },
                            { title: "Subtotal", field: "subtotal" }
                        ]}
                        data={service?.items?.map(item => ({
                            name: item.name,
                            quantity: item.quantity,
                            price: `$${item.price}`,
                            subtotal: `$${item.subtotal}`
                        }))}
                        business={business}
                        user={user}
                    />
                </div>
            </div>
        </>
    );
};

export default ServiceDetailsModal;
