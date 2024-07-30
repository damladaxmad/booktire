import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, TextField } from '@material-ui/core';
import MaterialTable from 'material-table';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { constants } from '../../Helpers/constantsFile';
import CustomButton from '../../reusables/CustomButton';
import swal from 'sweetalert';
import SalesDetailsModal from '../reports/SalesDetailsModal';

export default function PurchaseTable({editPurchase}) {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = useSelector(state => state?.login?.token);
    const user = useSelector(state => state.login.activeUser);
    const { business } = useSelector(state => state.login.activeUser);
    const [selectedPurchase, setSelectedPurchase] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const numberFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = () => {
        setLoading(true);
        axios.get(`${constants.baseUrl}/purchases/get-business-purchases/${business?._id}?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            setPurchases(res?.data?.data?.purchases);
        }).catch(error => {
            console.error("Error fetching purchases:", error);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleViewClick = () => {
        fetchPurchases();
    };

    const handleCancelPurchase = (purchaseId) => {
        swal({
            title: "Ma Hubtaa?",
            text: "Are you sure you want to cancel this purchase?",
            icon: "warning",
            buttons: {
                cancel: 'No',
                confirm: { text: 'Yes', className: 'sweet-warning' },
            }
        }).then((response) => {
            if (response) {
                axios.post(`${constants.baseUrl}/purchases/cancel-business-purchase/${business._id}/${purchaseId}`, {}, {
                    headers: {
                        "authorization": token
                    }
                }).then(res => {
                    swal({ text: "Successfully Canceled Purchase!", icon: "success", timer: 2000 });
                    fetchPurchases();
                }).catch(err => {
                    swal({ text: err?.response?.data?.message, icon: "error", timer: 2000 });
                });
            }
        });
    };

    const handlePurchaseNumberClick = (purchase) => {
        setSelectedPurchase(purchase);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPurchase(null);
    };

    const columns = [
        {title: "Receipt", field: "purchaseNumber", render: rowData => <p style = {{color: "blue", cursor: "pointer" }}
        onClick={()=> handlePurchaseNumberClick(rowData)}>
            Inv-{rowData?.purchaseNumber}
        </p>},
        { title: 'Payment Type', field: 'paymentType' },
        { title: 'User', field: 'user' },
        { title: 'Date', field: 'date', render: rowData => moment(rowData.date).format('YYYY-MM-DD') },
        { title: 'Discount', field: 'discount' },
        { title: 'Total', field: 'total', render: rowData => <p>{numberFormatter.format(rowData?.total)}</p> },
        { title: 'Status', field: 'status' },
        {
            title: 'Action',
            render: rowData => (
                <div style = {{display: "flex", flexDirection: "row", gap: "5px"}}>
                <button onClick={() => handleCancelPurchase(rowData._id)}>Cancel</button>
                <button onClick={() => editPurchase(rowData)}>Edit</button>
                </div>
            )
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
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
                <CustomButton text="View" height="37px" width="100px" fontSize='14px'
                 onClick={handleViewClick} />
            </div>
            {loading ? (
                <div style={{ textAlign: 'center' }}>
                    <CircularProgress />
                </div>
            ) : (
                <MaterialTable
                    title="Purchases"
                    columns={columns}
                    data={purchases}
                    options={{
                        pageSizeOptions: [5, 10, 20],
                        pageSize: 10,
                        search: false,
                        paging: false,
                        toolbar: false,
                        headerStyle: { fontWeight: "bold" }
                    }}
                    style={{ boxShadow: "none", border: "1px solid lightgray" }}
                />
            )}

            <SalesDetailsModal open={modalOpen} handleClose={handleCloseModal} sale={selectedPurchase} business={business} user = {user} />
        </div>
    );
}
