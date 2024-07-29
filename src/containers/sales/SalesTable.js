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

export default function SalesTable({editSale}) {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = useSelector(state => state?.login?.token);
    const user = useSelector(state => state.login.activeUser);
    const { business } = useSelector(state => state.login.activeUser);
    const [selectedSale, setSelectedSale] = useState()
    const [modalOpen, setModalOpen] = useState(false)
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = () => {
        setLoading(true);
        axios.get(`${constants.baseUrl}/sales/get-business-sales/${business?._id}?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            setSales(res?.data?.data?.sales);
        }).catch(error => {
            console.error("Error fetching sales:", error);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleViewClick = () => {
        fetchSales();
    };

    const handleCancelSale = (saleId) => {
        swal({
            title: "Ma hubtaa?",
            text: "Ma hubtaa inaa Cancel gareyso sale kaan?",
            icon: "warning",
            buttons: {
                cancel: 'No',
                confirm: { text: 'Yes', className: 'sweet-warning' },
            }
        }).then((response) => {
            if (response) {
                axios.post(`${constants.baseUrl}/sales/cancel-business-sale/${business._id}/${saleId}`, {}, {
                    headers: {
                        "authorization": token
                    }
                }).then(res => {
                    swal({ text: "Successfully Canceled Sale!", icon: "success", timer: 2000 });
                    fetchSales();
                }).catch(err => {
                    swal({ text: err?.response?.data?.message, icon: "error", timer: 2000 });
                });
            }
        });
    };

    const handleSalesNumberClick = (sale) => {
        setSelectedSale(sale);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedSale(null);
    };

    const columns = [
        {title: "Receipt", field: "saleNumber", render: rowData => <p style = {{color: "blue", cursor: "pointer" }}
        onClick={()=> handleSalesNumberClick(rowData)}>
            Receipt-{rowData?.saleNumber}
        </p>},
        { title: 'Payment', field: 'paymentType' },
        { title: 'User', field: 'user' },
        { title: 'Date', field: 'date', render: rowData => moment(rowData.date).format('YYYY-MM-DD') },
        { title: 'Discount', field: 'discount' },
        { title: 'Total', field: 'total' },
        { title: 'Status', field: 'status' },
        {
            title: 'Action',
            render: rowData => (
                <div style = {{display: "flex", flexDirection: "row", gap: "5px"}}>
                <button onClick={() => handleCancelSale(rowData._id)}>Cancel</button>
                <button onClick={() => {
                    editSale(rowData)
                }}
                    >Edit</button>
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
                    title="Sales"
                    columns={columns}
                    data={sales}
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

<SalesDetailsModal open={modalOpen} handleClose={handleCloseModal} sale={selectedSale} business={business} user={user} />

        </div>
    );
}
