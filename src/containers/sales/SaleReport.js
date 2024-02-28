import { Typography, Button, TextField, CircularProgress } from "@material-ui/core";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function SalesReport() {
    const token = useSelector(state => state?.login?.token);
    const { business } = useSelector(state => state.login.activeUser);
    const [sales, setSales] = useState([]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const fetchSales = () => {
        setLoading(true);
        axios.get(`https://booktire-api.onrender.com/api/client/v1/sales/get-business-sales/${business?._id}?startDate=${startDate}&endDate=${endDate}`, {
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

    useEffect(() => {
        fetchSales();
    }, []);

    const handleViewClick = () => {
        fetchSales();
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <TextField
                    size = "small"
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
                     size = "small"
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
                <Button variant="contained" color="primary" onClick={handleViewClick}>
                    View
                </Button>
            </div>
            {loading ? (
                <div style={{ textAlign: 'center' }}>
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    {sales.length > 0 ? (
                        sales.map(sale => <Sale key={sale._id} sale={sale} />)
                    ) : (
                        <Typography>No data</Typography>
                    )}
                </div>
            )}
        </div>
    );
}

function Sale({ sale }) {
    return (
        <div style={{ display: "flex", gap: "14px" }}>
            <Typography>{sale.paymentType}</Typography>
            <Typography>{sale.user}</Typography>
            <Typography>{moment(sale.date).format("YYYY-MM-DD")}</Typography>
            <Typography>{sale.total}</Typography>
        </div>
    );
}
