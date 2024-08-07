import React, { useEffect, useState } from "react";
import { Typography, TextField, CircularProgress, Modal, Backdrop, Fade, Box } from "@material-ui/core";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import CustomButton from "../../reusables/CustomButton";
import { constants } from "../../Helpers/constantsFile";
import MaterialTable from "material-table";
import SalesDetailsModal from "./SalesDetailsModal";

export default function PurchaesReport() {
    const token = useSelector(state => state?.login?.token);
    const { business } = useSelector(state => state.login.activeUser);
    const user = useSelector(state => state.login.activeUser);
    const [purchases, setPurchases] = useState([]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchPurchases = () => {
        setLoading(true);
        axios.get(`${constants.baseUrl}/purchases/get-business-purchases/${business?._id}?startDate=${moment(startDate).format("YYYY-MM-DD")}&endDate=${moment(endDate).format("YYYY-MM-DD")}`, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            setPurchases(res?.data?.data?.purchases);
        }).catch(error => {
            console.error("Error fetching sales:", error);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    const handleViewClick = () => {
        fetchPurchases();
    };

    const handlePurchasesNumberClick = (sale) => {
        setSelectedPurchase(sale);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPurchase(null);
    };

    return (
        <div style={{ width: "97.5%", marginTop: "30px" }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', }}>
                <TextField
                    size="small"
                    variant="outlined"
                    type="date"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    style={{ marginRight: '20px' }}
                />
                <TextField
                    size="small"
                    variant="outlined"
                    type="date"
                    label="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    style={{ marginRight: '20px' }}
                />
                <CustomButton text="View" height="37px" width="100px" fontSize="14px" onClick={handleViewClick} />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: "10px" }}>
                    <CircularProgress />
                </div>
            ) : (
                <MaterialTable
                    title="Sales Report"
                    columns={[
                        {
                            title: 'Invoice', field: 'purchaseNumber', render: rowData => (
                                <Typography
                                    style={{ color: 'blue', cursor: 'pointer' }}
                                    onClick={() => handlePurchasesNumberClick(rowData)}
                                >
                                    Inv-{rowData.purchaseNumber}
                                </Typography>
                            )
                        },
                        // { title: 'products', field: 'products', render: rowData => <p>{rowData?.products?.length}</p> },
                        { title: 'Date', field: 'date', render: rowData => moment(rowData.date).format("YYYY-MM-DD") },
                        { title: 'User', field: 'user', width: "4%" },
                        { title: 'Payment', field: 'paymentType' },
                        { title: 'Subtotal', field: 'subtotal', render: rowData => `$${(rowData?.total + rowData?.discount)?.toFixed(2)}` },
                        { title: 'Discount', field: 'discount', render: rowData => `$${rowData?.discount}` },
                        { title: 'Total', field: 'total', render: rowData => `$${rowData?.total?.toFixed(2)}` }
                    ]}
                    data={purchases?.map((sale, index) => ({
                        purchaseNumber: sale?.purchaseNumber,
                        products: sale?.products,
                        date: sale.date,
                        user: sale.user,
                        paymentType: sale?.paymentType,
                        subtotal: sale.subtotal,
                        discount: sale.discount,
                        total: sale.total
                    }))}
                    options={{
                        search: false,
                        paging: false,
                        toolbar: false,
                        headerStyle: { fontWeight: "bold" }
                    }}
                    style={{ marginTop: "20px", boxShadow: "none", width: "100%" }}
                />
            )}

            <SalesDetailsModal open={modalOpen} handleClose={handleCloseModal} sale={selectedPurchase} business={business} user={user} />

            {/* <SalesDashboard sales={sales} /> */}
        </div>
    );
}

// function SalesDashboard({ sales }) {
//     let numberOfSales = 0;
//     let revenueFromSales = 0;
//     let cashOnHand = 0;
//     let salesInvoice = 0;
//     let costOfGoodsSold = 0;

//     sales?.forEach(sale => {
//         numberOfSales++;
//         revenueFromSales += sale.total;
//         if (sale.paymentType === "cash") cashOnHand += sale.total;
//         if (sale.paymentType === "invoice") salesInvoice += sale.total;

//         sale.products.forEach(product => {
//             costOfGoodsSold += product.unitPrice * product.quantity;
//         });
//     });

//     const data1 = [
//         { title: "Number Of Sales", value: numberOfSales, isMoney: false },
//         { title: "Cash On Hand", value: cashOnHand, isMoney: true },
//         { title: "Sales Invoice", value: salesInvoice, isMoney: true },
//     ];

//     const data2 = [
//         { title: "Revenue From Sales", value: revenueFromSales, isMoney: true },
//         { title: "Cost Of Goods Sold", value: costOfGoodsSold, isMoney: true },
//         { title: "Profit From Sales", value: revenueFromSales - costOfGoodsSold, isMoney: true }
//     ];

//     return (
//         <div style={{
//             width: "100%",
//             display: "flex",
//             gap: "20px",
//             marginTop: "25px",
//             marginLeft: "auto",
//             marginRight: "auto"
//         }}>
//             {[data1, data2].map((data, index) => (
//                 <div key={index} style={{
//                     width: "50%",
//                     borderRadius: "12px",
//                     border: "1px solid lightgray",
//                     padding: "10px 25px",
//                     background: "white"
//                 }}>
//                     {data.map((d, index) => (
//                         <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: index < data.length - 1 ? "1px solid lightgray" : "none" }}>
//                             <Typography style={{ fontSize: "14px", color: "black" }}>{d.title}</Typography>
//                             <Typography style={{ fontSize: "14px", color: "black" }}>{d.isMoney && "$"}{d.value}</Typography>
//                         </div>
//                     ))}
//                 </div>
//             ))}
//         </div>
//     );
// }
