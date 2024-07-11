import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, TextField } from '@material-ui/core';
import MaterialTable from 'material-table';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { constants } from '../../Helpers/constantsFile';
import CustomButton from '../../reusables/CustomButton';

export default function ServiceTable() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = useSelector(state => state?.login?.token);
    const { business } = useSelector(state => state.login.activeUser);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = () => {
        setLoading(true);
        axios.get(`${constants.baseUrl}/services/get-business-services/${business?._id}?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            setServices(res?.data?.data?.services);
        }).catch(error => {
            console.error("Error fetching services:", error);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleViewClick = () => {
        fetchServices();
    };

    const handleCancelService = (serviceId) => {
        axios.post(`${constants.baseUrl}/services/cancel-business-service/${business._id}/${serviceId}`, {}, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            alert("Successfully Canceled Service!")
            fetchServices()
        }).catch(err => {
            alert(err?.response?.data?.message)
        })
    };

    const columns = [
        { title: 'Service Type', field: 'paymentType' },
        { title: 'User Name', field: 'user' },
        { title: 'Date', field: 'date', render: rowData => moment(rowData.date).format('YYYY-MM-DD') },
        { title: 'Discount', field: 'discount' },
        { title: 'Total', field: 'total' },
        { title: 'Status', field: 'status' },
        {
            title: 'Action',
            render: rowData => (
                <button onClick={() => handleCancelService(rowData._id)}>Cancel Service</button>
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
                <CustomButton text="View" height="37px" width="100px" fontSize="14px" onClick={handleViewClick} />
            </div>
            {loading ? (
                <div style={{ textAlign: 'center' }}>
                    <CircularProgress />
                </div>
            ) : (
                <MaterialTable
                    title="Services"
                    columns={columns}
                    data={services}
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
        </div>
    );
}
