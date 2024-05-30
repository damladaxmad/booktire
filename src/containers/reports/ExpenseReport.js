import React, { useEffect, useState } from "react";
import { Typography, TextField, CircularProgress, Modal, Backdrop, Fade, Box } from "@material-ui/core";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import CustomButton from "../../reusables/CustomButton";
import { constants } from "../../Helpers/constantsFile";
import MaterialTable from "material-table";
import SalesDetailsModal from "./SalesDetailsModal";

export default function ExpensesReport() {
    const token = useSelector(state => state?.login?.token);
    const { business } = useSelector(state => state.login.activeUser);
    const [expenses, setExpenses] = useState([]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

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
                        { title: 'Description', field: 'description', width: "4%" },
                        { title: 'Amount', field: 'amount', render: data => <p>${data?.amount}</p> },
                        { title: 'Payment', field: 'paymentMethod' },
                        { title: 'Type', field: 'amount', render: rowData => <p>{rowData?.expenseType?.name}</p> },
                        { title: 'Date', field: 'date', render: rowData => moment(rowData.date).format("YYYY-MM-DD") },
                    ]}
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

            <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "flex-end",
                marginTop: "15px"
             }}>
                <Typography style={{ fontSize: "16px", textAlign: "right" }}> TOTAL:</Typography>
                <Typography style={{ fontSize: "16px", fontWeight: "bold", textAlign: "right" }}> ${total}</Typography>
            </div>


        </div>
    );
}
