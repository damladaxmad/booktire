import React, { useEffect, useState } from "react";
import { Typography, TextField, CircularProgress, Modal, Backdrop, Fade, Box } from "@material-ui/core";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import CustomButton from "../../reusables/CustomButton";
import { constants } from "../../Helpers/constantsFile";
import MaterialTable from "material-table";
import SalesDetailsModal from "./SalesDetailsModal";
import PrintableTableComponent from "./PintableTableComponent";
import { useReactToPrint } from "react-to-print";

export default function ExpensesReport() {
    const token = useSelector(state => state?.login?.token);
    const { business } = useSelector(state => state.login.activeUser);
    const [expenses, setExpenses] = useState([]);
    const getCurrentMonthStartDate = () => {
        const date = new Date();
        date.setDate(1);
        return date.toISOString().split('T')[0];
    };
    const [startDate, setStartDate] = useState(getCurrentMonthStartDate());
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const numberFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const fetExpenses = () => {
        setLoading(true);
        axios.get(`${constants.baseUrl}/expenses/get-business-expense/${business?._id}?startDate=${moment(startDate).format("YYYY-MM-DD")}&endDate=${moment(endDate).format("YYYY-MM-DD")}`, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            console.log(res?.data?.data)
            setExpenses(res?.data?.data?.expenses);
        }).catch(error => {
            console.error("Error fetching sales:", error);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetExpenses();
    }, []);

    const handleViewClick = () => {
        fetExpenses();
    };

    let total = 0
    expenses?.map(expense => {
        total += expense?.amount
    })

    const columns = [
        { title: 'Date', field: 'date', render: rowData => moment(rowData.date).format("YYYY-MM-DD") },
        { title: 'Description', field: 'description', width: "4%" },
        { title: 'Amount', field: 'amount', render: data => <p>${data?.amount}</p> },
        // { title: 'Payment', field: 'paymentMethod' },
        { title: 'Type', field: 'amount', render: rowData => <p>{rowData?.expenseType?.name}</p> },
    ]

    const handlePrint = useReactToPrint({
        content: () => document.querySelector('.printable-table'),
    });


    return (
        <div style={{ width: "97.5%", marginTop: "30px" }}>

            <PrintableTableComponent columns={columns} data={expenses}
                reportTitle={`Expenses Report (${moment(startDate)?.format("YYYY-MM-DD")} - ${moment(endDate)?.format("YYYY-MM-DD")})`}>
                <div style={{ marginTop: "10px" }}>
                    <Typography style={{ fontSize: "16px" }}>  TOTAL:
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}> ${numberFormatter.format(total)} </span></Typography>
                </div>
            </PrintableTableComponent>

            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', }}>
            <CustomButton text="Print" onClick={handlePrint} height="37px" width="100px" fontSize="14px" bgColor="white" color="black" 
            style = {{marginRight: "auto"}}/>

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
                    columns={columns}
                    data={expenses}
                    options={{
                        search: false,
                        paging: false,
                        toolbar: false,
                        headerStyle: { fontWeight: "bold" }
                    }}
                    style={{ marginTop: "20px", boxShadow: "none", width: "100%" }}
                />
            )}

            <div style={{
                display: "flex", gap: "10px", width: "100%", justifyContent: "flex-end",
                marginTop: "15px"
            }}>
                <Typography style={{ fontSize: "16px", textAlign: "right" }}> TOTAL:</Typography>
                <Typography style={{ fontSize: "16px", fontWeight: "bold", textAlign: "right" }}> ${total?.toFixed(2)}</Typography>
            </div>


        </div>
    );
}
