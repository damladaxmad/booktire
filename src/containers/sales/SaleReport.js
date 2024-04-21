import { Typography, Button, TextField, CircularProgress } from "@material-ui/core";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useSelector } from "react-redux";
import CustomButton from "../../reusables/CustomButton";
import { constants } from "../../Helpers/constantsFile";

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
                <CustomButton text = "View" height = "37px" width = "100px" fontSize="14px"
                onClick={handleViewClick} />
            </div>        
            <SalesDashboard sales = {sales}/>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: "10px" }}>
                    <CircularProgress />
                </div>
            ) : (
                <div style = {{marginTop: "25px", display:"flex", flexDirection: "column", gap: "25px"}}>
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
        <div style={{ display: "flex", gap: "14px", borderRadius: "5px", border: "1px solid #E3E3E3",
        width: "80%", flexDirection: "column" }}>

            <div style = {{background: constants.backdropColor, display: "flex", width: "100%", padding: "5px 15px",
            justifyContent: "space-between"
            }}> 
            <Typography style = {{fontSize: "16px", }}>{sale.paymentType}</Typography>
            <Typography style = {{fontSize: "16px", }}>{sale.user}</Typography>
            <Typography style = {{fontSize: "16px", }}>{moment(sale.date).format("YYYY-MM-DD")}</Typography>
            <Typography style = {{fontSize: "16px", }}> discount: ${sale.discount}</Typography>
            <Typography style = {{fontSize: "16px", }}>${sale.total}</Typography>
            </div>

            <div style = {{display: "flex", flexDirection: "column", gap: "10px",
          width: "80%", padding: "0px 15px", marginLeft:"20px", marginBottom: "10px"}}>
                {sale?.products?.map((product, index) => {
                    return (
                        <div key={index} style={{
                            display: "flex", 
                             alignItems: "center", 
                        }}>
                            <MdKeyboardArrowRight style={{
                                fontSize: "18px", color: "gray", flex: "0.2"
                            }} />
                            <Typography style={{
                                fontSize: "14px", color: "black", flex: "1.5"
                            }}>{product.name}</Typography>
                            <Typography style={{
                                fontSize: "14px", color: "black", flex: "0.5"
                            }}>{product.quantity}</Typography>
                            <Typography style={{
                                fontSize: "14px", color: "black", flex: "0.8"
                            }}>${product.salePrice}</Typography>
                            <Typography style={{
                                fontSize: "14px", color: "black", flex: "0.8"
                            }}>${product.subtotal}</Typography>
                        </div>
                    )
                })}
            </div>
        
        </div>
    );
}

function SalesDashboard({ sales }) {
    let numberOfSales = 0;
    let revenueFromSales = 0;
    let cashOnHand = 0;
    let salesInvoice = 0;
    let costOfGoodsSold = 0;

    sales?.forEach(sale => {
        numberOfSales++;
        revenueFromSales += sale.total;
        if (sale.paymentType === "cash") cashOnHand += sale.total;
        if (sale.paymentType === "invoice") salesInvoice += sale.total;

        sale.products.forEach(product => {
            costOfGoodsSold += product.unitPrice * product.quantity;
        });
    });

    let data = [
        { title: "Number Of Sales", value: numberOfSales, isMoney: false },
        { title: "Revenue From Sales", value: revenueFromSales, isMoney: true },
        { title: "Cash On Hand", value: cashOnHand, isMoney: true },
        { title: "Sales Invoice", value: salesInvoice, isMoney: true },
        { title: "Cost Of Goods Sold", value: costOfGoodsSold, isMoney: true }, 
        { title: "Profit From Sales", value: revenueFromSales - costOfGoodsSold, isMoney: true }, 
    ];

    return (
        <div style={{
            background: "white", width: "100%",
            borderRadius: "12px", display: "flex", flexDirection: "column",
            gap: "16px", marginRight: "18px", flexDirection: "row", flexWrap: "wrap"
        }}>

            {data.map((d, index) => (
                <div key={index} style={{
                    display: "flex", border: "1px solid lightgray", padding: "10px",
                    borderRadius: "5px", width: "48%", alignItems: "center"
                }}>
                    <MdKeyboardArrowRight style={{
                        fontSize: "18px", color: "gray", flex: "0.2"
                    }} />
                    <Typography style={{
                        fontSize: "14px", color: "black", flex: "1.5"
                    }}>{d.title}</Typography>
                    <Typography style={{
                        fontSize: "14px", color: "black", flex: "0.3"
                    }}>{d.isMoney && "$"}{d.value}</Typography>
                </div>
            ))}
        </div>
    );
}

