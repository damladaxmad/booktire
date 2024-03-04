import { Typography } from "@material-ui/core"
import StockTable from "./StockTable"
import { useSelector } from "react-redux"
import { constants } from "../../Helpers/constantsFile"
import { useEffect, useState } from "react"
import axios from "axios"

const StockSummary = (props) => {
    const { business } = useSelector(state => state.login.activeUser)
    const url = `${constants.baseUrl}/products/get-business-available-products/${business?._id}`
    const token = useSelector(state => state.login?.token)
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(()=> {
        setLoading(true);
        axios.get(url, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            setProducts(res?.data?.data?.products);
            setLoading(false);
        }).catch(err => {
            console.log(err?.response?.data?.message);
            setLoading(false);
        });
    }, []);

    console.log(products)

    const columns = [
        { title: "Product Name", field: "name", width: "2%" },
        { title: "Quantity", field: "quantity" },
        { title: "Unit Price", field: "unitPrice" },
        { title: "Sale Price", field: "salePrice" },
        { title: "Total Cost", field: "totalCost" },
    ];

    return (
        <div style = {{
            background: "white",
            borderRadius: "8px",
            padding: "30px 50px",
            display: "flex",
            gap: "30px",
            flexDirection: "column",
            width: "100%"
        }}>
            <div style = {{display: "flex", justifyContent: "space-between"}}>
                <div>
                    <Typography style = {{
                        fontWeight: "bold",
                        fontSize: "20px"
                    }}> Stock Summary</Typography>
                    <Typography style = {{
                        fontSize: "18px",
                        color: "#6C6C6C"
                    }}> {loading ? 'Loading...' : (products.length > 0 ? `${products.length} products` : 'No data')}</Typography>
                </div>
            </div>
           
            <StockTable columns = {columns} 
                        kind = "Report" 
                        data = {products} 
                        way = "summary" 
                        state = {loading ? loading : "no data to display"}
                        />
        </div>
    );
}

export default StockSummary;
