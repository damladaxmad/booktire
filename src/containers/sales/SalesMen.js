import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, TextField } from '@material-ui/core';
import MaterialTable from 'material-table';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { constants } from '../../Helpers/constantsFile';
import CustomButton from '../../reusables/CustomButton';
import PrintableTableComponent from "../reports/PintableTableComponent";
import { useReactToPrint } from 'react-to-print';

export default function SalesMen() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profits, setProfits] = useState([]);
    const token = useSelector(state => state?.login?.token);
    const { business } = useSelector(state => state.login.activeUser);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/deentire-application.appspot.com/o/LOGO%2Fliibaan.jpeg?alt=media&token=f5b0b3e7-a5e0-4e0d-b3d2-20a920f97fde`;

    const numberFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    useEffect(() => {
        fetchSales();
    }, [startDate, endDate]);

    const handlePrint = useReactToPrint({
        content: () => document.querySelector('.printable-table'),
    });

    const fetchSales = () => {
        setLoading(true);
        axios.get(`${constants.baseUrl}/sales/get-business-sales/${business?._id}?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            setSales(res?.data?.data?.sales);
            calculateProfitsAndSalesCount(res?.data?.data?.sales);
        }).catch(error => {
            console.error("Error fetching sales:", error);
        }).finally(() => {
            setLoading(false);
        });
    };

    const calculateProfitsAndSalesCount = (salesData) => {
        const userProfitsAndSalesCount = salesData.reduce((acc, sale) => {
            const profit = sale.total - sale.cogs;
            const user = sale.user;

            if (user) {
                if (acc[user]) {
                    acc[user].profit += profit;
                    acc[user].salesCount += 1;
                } else {
                    acc[user] = { profit, salesCount: 1 };
                }
            }

            return acc;
        }, {});

        const profitsArray = Object.keys(userProfitsAndSalesCount).map(user => ({
            user,
            profit: userProfitsAndSalesCount[user].profit,
            salesCount: userProfitsAndSalesCount[user].salesCount
        }));

        profitsArray.sort((a, b) => b.profit - a.profit);

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
        });
    };

    const columns = [
        {title: "No", field: "no", render: (rowData, index) => <p>{rowData?.tableData?.id + 1}</p>},
        { title: 'Name', field: 'user' },
        { title: 'Profit', field: 'profit', render: rowData => <p>{numberFormatter.format(rowData?.profit)}</p> },
        { title: 'No. Sales', field: 'salesCount' }
    ];

    let totalProfits = 0;
    profits?.map(profit => {
        totalProfits += profit?.profit;
    });

    return (
        <div>
            <div style={{ marginBottom: '20px', marginTop: "20px" }}>
                <PrintableTableComponent columns={columns} data={profits} imageUrl={imageUrl}
                    reportTitle={`Salesman Profits (${moment(startDate).format("YYYY-MM-DD")} - ${moment(endDate).format("YYYY-MM-DD")})`}>
                    <div style={{ marginTop: "10px" }}>
                        <Typography style={{ fontSize: "16px" }}> TOTAL:
                            <span style={{ fontWeight: "bold", fontSize: "18px" }}> {numberFormatter.format(totalProfits)} </span>
                        </Typography>
                    </div>
                </PrintableTableComponent>
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
                <CustomButton text="Print" onClick={handlePrint} height="37px" fontSize="14px"
                    style={{ width: '100px', marginLeft: "50px", background: "white", color: "black" }} />
            </div>
            {loading ? (
                <div style={{ textAlign: 'center' }}>
                    <CircularProgress />
                </div>
            ) : (
                <div style={{
                    display: "flex", gap: "10px", flexDirection: "column",
                    width: "60%",
                }}>
                    {profits.map((userProfit, index) => (
                        <div key={index} style={{
                            background: "white", display: "flex",
                            flexDirection: "row", padding: "10px 20px", borderRadius: "10px", gap: "10px",
                            justifyContent: "space-between",
                        }}>
                            <Typography variant="body1" style = {{flex: 2}}>{userProfit.user}</Typography>
                            <Typography variant="body1" style = {{flex: 1.5}}>{numberFormatter.format(userProfit.profit)}</Typography>
                            <Typography variant="body1" style = {{flex: 0.2}}>{userProfit.salesCount}</Typography>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
