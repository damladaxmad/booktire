import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, TextField } from '@material-ui/core';
import MaterialTable from 'material-table';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { constants } from '../../Helpers/constantsFile';
import CustomButton from '../../reusables/CustomButton';

export default function SalesMen() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profits, setProfits] = useState([]);
    const token = useSelector(state => state?.login?.token);
    const { business } = useSelector(state => state.login.activeUser);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const numberFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = () => {
        setLoading(true);
        axios.get(`https://booktire-api.onrender.com/api/client/v1/sales/get-business-sales/${business?._id}?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            setSales(res?.data?.data?.sales);
            calculateProfits(res?.data?.data?.sales);
        }).catch(error => {
            console.error("Error fetching sales:", error);
        }).finally(() => {
            setLoading(false);
        });
    };

    const calculateProfits = (salesData) => {
        const userProfits = salesData.reduce((acc, sale) => {
            const profit = sale.total - sale.cogs;
            if (acc[sale.user]) {
                acc[sale.user] += profit;
            } else {
                acc[sale.user] = profit;
            }
            return acc;
        }, {});

        const profitsArray = Object.keys(userProfits).map(user => ({
            user,
            profit: userProfits[user],
        }));

        setProfits(profitsArray);
    };

    const handleViewClick = () => {
        fetchSales();
    };

    const handleCancelSale = (saleId) => {
        axios.post(`${constants.baseUrl}/sales/cancel-business-sale/${business._id}/${saleId}`, {}, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            alert("Successfully Canceled Sale!")
            fetchSales()
        }).catch(err => {
            alert(err?.response?.data?.message)
        })
    };

    const columns = [
        { title: 'User Name', field: 'user' },
        { title: 'Date', field: 'date', render: rowData => moment(rowData.date).format('YYYY-MM-DD') },
        { title: 'Profit', field: 'profit',
            render: rowData => <p>{numberFormatter.format(rowData?.total - rowData?.cogs)}</p>
         },
       
    ];

    return (
        <div>
            <div style={{ marginBottom: '20px', marginTop: "20px" }}>
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
               <div style = {{ display: "flex", gap: "10px", flexDirection: "column",
                width: "60%", 
               }}>
                   {profits.map((userProfit, index) => (
                       <div key={index} style={{background: "white", display: "flex",
                        flexDirection: "row", padding: "10px 20px", borderRadius: "10px", gap: "10px",
                        
                        justifyContent: "space-between",  }}>
                           <Typography variant="body1">{userProfit.user}</Typography>
                           <Typography variant="body1">{numberFormatter.format(userProfit.profit)}</Typography>
                       </div>
                   ))}
               </div>  
            )}
        </div>
    );
}
