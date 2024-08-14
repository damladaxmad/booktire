import { Typography, CircularProgress } from "@mui/material";
import { constants } from "../../Helpers/constantsFile";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

export default function LastTransactions() {

    const defaultArray = [
        {description: "From Expense", credit: 100, account: {accountName: "Premier Bank"}, date: "2024/08/14"},
        {description: "From Sales", debit: 100, account: {accountName: "Premier Bank"}, date: "2024/08/14"},
        {description: "From Expense", credit: 100, account: {accountName: "Premier Bank"}, date: "2024/08/14"}
    ]

    const [transactions, setTransactions] = useState(defaultArray);
    const [loading, setLoading] = useState(true); // State for loading indicator
    const { business } = useSelector(state => state.login?.activeUser);
    const token = useSelector(state => state.login?.token);
    const today = new Date()

    const fetchTransactions = () => {
        axios.get(`${constants.baseUrl}/account-transactions/get-business-account-transactions/${business?._id}`, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            console.log(res?.data?.data)
            setTransactions(res?.data?.data?.accountAccountTransactions || defaultArray);
        }).catch(error => {
            console.error("Error fetching transactions:", error);
        }).finally(() => {
            setLoading(false); 
        });
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div style={{
            marginTop: "15px", display: "flex", flexDirection: "column",
            gap: "16px", width: "100%"
        }}>
            {loading ? ( // Display loading indicator if loading is true
                <div style={{ textAlign: "center" }}>
                    <CircularProgress style = {{color: constants.pColor}} />
                    <Typography variant="body2" style={{ marginTop: 10 }}>Loading...</Typography>
                </div>
            ) : (
                <>
                    {transactions.length > 0 ? (
                        transactions.slice(-5).reverse().map((d, index) => {
                            const actualIndex = transactions.length - index - 1;
                            return <Transaction key={actualIndex} data={d} index={index} />;
                        })
                    ) : (
                        <Typography variant="body2" style={{ textAlign: "center" }}>No data</Typography>
                    )}
                </>
            )}
        </div>
    )
}

function Transaction({ data, index }) {
    return (
        <div style={{
            display: "flex", flexDirection: "row", width: "100%",
            background: data?.credit  ? constants.pColor : "white", borderRadius: "8px", padding: "15px 20px",
            alignItems: "center", justifyContent: "space-between",
            color: data?.credit ? "white" : "black", position: "relative"
        }}>

            <div style={{
                position: 'absolute', top: "20%", bottom: "20%", left: 0, width: '6px',
                backgroundColor: data?.credit ? "white" : '#C8C8C8',
                borderRadius: "0px 6px 6px 0px"
            }}></div>

            <div style={{ display: "flex", flexDirection: "column", }}>
                <Typography style={{ fontSize: "15px", fontWeight: "bold" }}>Premier Bank</Typography>
                <Typography style={{ fontSize: "14px", color: data?.credit ? constants.colorSubText : "#B4B4B4" }}> {moment(data.date).format("YYYY-MM-DD")} - {data?.description}</Typography>
            </div>
            <Typography style={{ fontSize: "15px" }}> ${data.debit ? data.debit.toFixed(2) : data.credit.toFixed(2)}</Typography>
        </div>
    )
}
