import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { Typography, Button, TextField, CircularProgress, Divider } from '@material-ui/core';
import { constants } from '../../Helpers/constantsFile';
import CustomButton from '../../reusables/CustomButton';

export default function IncomeStatement() {
    const token = useSelector(state => state?.login?.token);
    const { business } = useSelector(state => state.login.activeUser);
    const [statement, setStatement] = useState({});
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const numberFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const fetchStatement = () => {
        setLoading(true);
        axios.get(`${constants.baseUrl}/reports/get-business-income-statement/${business?._id}?startDate=${moment(startDate).format("YYYY-MM-DD")}&endDate=${moment(endDate).format("YYYY-MM-DD")}`, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            setStatement(res?.data?.data);
        }).catch(error => {
            console.error("Error fetching statement:", error);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchStatement();
    }, []);

    const handleViewClick = () => {
        fetchStatement();
    };

    return (
        <div style={{
            background: "white", borderRadius: "20px", padding: "40px",
            width: "75%", margin: "auto", boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginTop: "15px", position: 'relative'
        }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
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
                    style={{ marginRight: '16px' }}
                />
                <CustomButton text="View" height="37px" width="100px" fontSize="14px"
                    style={{ marginLeft: "10px" }}
                    onClick={handleViewClick} />
            </div>

            {loading && (
                <CircularProgress style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1
                }} />
            )}

            <div style={{ opacity: loading ? 0.5 : 1 }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
                        Revenues:
                    </Typography>
                    {statement.income && statement.income.details && Object.entries(statement.income.details).map(([name, amount], index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between',
                            marginTop: "10px", marginLeft: "20px"
                        }}>
                            <Typography style={{ fontSize: "16px" }}>{name}</Typography>
                            <Typography style={{ fontSize: "16px" }}>{numberFormatter.format(amount)}</Typography>
                        </div>
                    ))}
                    <Divider style={{ marginTop: "10px", marginLeft: "20px" }} />
                    <Typography style={{ fontSize: "16px", marginTop: '10px', marginLeft: "auto" }}>
                        TOTAL: <span style={{ fontSize: "16px", fontWeight: "bold" }}>{numberFormatter.format(statement.income?.totalIncome) || 0}</span>
                    </Typography>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
                        Expenses:
                    </Typography>
                    {statement.expenses && statement.expenses?.details && Object.entries(statement.expenses.details).map(([name, amount], index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between',
                            marginTop: "10px", marginLeft: "20px"
                        }}>
                            <Typography style={{ fontSize: "16px" }}>{name}</Typography>
                            <Typography style={{ fontSize: "16px" }}>{numberFormatter.format(amount)}</Typography>
                        </div>
                    ))}
                    <Divider style={{ marginTop: "10px", marginLeft: "20px" }} />
                    <Typography style={{ fontSize: "16px", marginTop: '10px', marginLeft: "auto" }}>
                        TOTAL: <span style={{ fontSize: "16px", fontWeight: "bold" }}>{numberFormatter.format(statement.expenses?.totalExpenses) || 0}</span>
                    </Typography>
                </div>

                <div style={{ border: "1px solid grey", background: "white", borderRadius: "5px", 
                    padding: "10px 25px", display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginTop: "25px"
                }}>
                    <Typography style={{ fontWeight: 'bold', fontSize: "18px" }}>
                        Net Income
                    </Typography>
                    <Typography style={{ fontWeight: 'bold', fontSize: "18px", color: statement?.netIncome < 0 && "red" }}>
                        {numberFormatter.format(statement.netIncome) || 0}
                    </Typography>
                </div>
            </div>
        </div>
    );
}
