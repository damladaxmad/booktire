import { Typography, CircularProgress } from "@mui/material";
import { constants } from "../../Helpers/constantsFile";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

export default function LatestTransactions() {

    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading indicator

    const { business } = useSelector(state => state.login?.activeUser);
    const token = useSelector(state => state.login?.token);
    const today = new Date()

    const fetchSales = () => {
        axios.get(`https://booktire-api.onrender.com/api/client/v1/sales/get-business-sales/${business?._id}?startDate=2024-02-01&endDate=${moment(today).format("YYYY-MM-DD")}`, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            setSales(res?.data?.data?.sales || []); // Set sales or empty array if no data
        }).catch(error => {
            console.error("Error fetching sales:", error);
        }).finally(() => {
            setLoading(false); // Set loading to false when data fetching completes
        });
    };

    useEffect(() => {
        fetchSales();
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
                    {sales.length > 0 ? (
                        sales.slice(-5).reverse().map((d, index) => {
                            const actualIndex = sales.length - index - 1;
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
            background: index === 0 ? constants.pColor : "white", borderRadius: "8px", padding: "15px 20px",
            alignItems: "center", justifyContent: "space-between",
            color: index === 0 ? "white" : "black", position: "relative"
        }}>

            <div style={{
                position: 'absolute', top: "20%", bottom: "20%", left: 0, width: '6px',
                backgroundColor: index === 0 ? "white" : '#C8C8C8',
                borderRadius: "0px 6px 6px 0px"
            }}></div>

            <div style={{ display: "flex", flexDirection: "column", }}>
                <Typography style={{ fontSize: "15px", fontWeight: "bold" }}> Products ({data.products?.length})</Typography>
                <Typography style={{ fontSize: "14px", color: index === 0 ? constants.colorSubText : "#B4B4B4" }}> {moment(data.date).format("YYYY-MM-DD")}</Typography>
            </div>
            <Typography style={{ fontSize: "15px" }}> {data.paymentType}</Typography>
            <Typography style={{ fontSize: "15px" }}> ${data.total}</Typography>
        </div>
    )
}
