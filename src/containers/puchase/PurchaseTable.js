import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, TextField } from '@material-ui/core';
import MaterialTable from 'material-table';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { constants } from '../../Helpers/constantsFile';
import CustomButton from '../../reusables/CustomButton';

export default function PurchaseTable() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = useSelector(state => state?.login?.token);
    const { business } = useSelector(state => state.login.activeUser);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = () => {
        setLoading(true);
        axios.get(`https://booktire-api.onrender.com/api/client/v1/purchases/get-business-purchases/${business?._id}?startDate=${startDate}&endDate=${endDate}`, {
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
        axios.post(`${constants.baseUrl}/purchases/cancel-business-purchase/${business._id}/${purchaseId}`, {}, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            alert("Successfully Canceled Purchase!")
            fetchPurchases()
        }).catch(err => {
            alert(err?.response?.data?.message)
        })
    };

    const columns = [
        { title: 'Payment Type', field: 'paymentType' },
        { title: 'User Name', field: 'user' },
        { title: 'Date', field: 'date', render: rowData => moment(rowData.date).format('YYYY-MM-DD') },
        { title: 'Discount', field: 'discount' },
        { title: 'Total', field: 'total' },
        { title: 'Status', field: 'status' },
        {
            title: 'Action',
            render: rowData => (
                <button onClick={() => handleCancelPurchase(rowData._id)}>Cancel Purchase</button>
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
                 <CustomButton text = "View" height = "37px" width = "100px" fontSize='14px'
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
                        headerStyle: {fontWeight:"bold"}
                    }}

                    style = {{boxShadow: "none", border: "1px solid lightgray"}}
                />
            )}
        </div>
    );
}
