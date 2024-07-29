import { Typography, MenuItem } from "@material-ui/core"
import StockTable from "./StockTable"
import { useSelector } from "react-redux"
import Select from "react-select"
import { constants } from "../../Helpers/constantsFile"
import { useEffect, useState } from "react"
import axios from "axios"
import { useReactToPrint } from 'react-to-print';
import PrintableTableComponent from "./PintableTableComponent"
import CustomButton from "../../reusables/CustomButton"

const StockSummary = (props) => {
    const { business } = useSelector(state => state.login.activeUser)
    const url = `${constants.baseUrl}/products/get-business-available-products/${business?._id}`
    const token = useSelector(state => state.login?.token)
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // Store all products
    const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category

    const numberFormatter = new Intl.NumberFormat('en-US', {
        // style: 'currency',
        // currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/deentire-application.appspot.com/o/LOGO%2Fliibaan.jpeg?alt=media&token=f5b0b3e7-a5e0-4e0d-b3d2-20a920f97fde`;

    useEffect(()=> {
        setLoading(true);
        axios.get(url, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            const fetchedProducts = res?.data?.data?.products;
            setProducts(fetchedProducts);
            setAllProducts(fetchedProducts); // Store all products
            setLoading(false);
        }).catch(err => {
            console.log(err?.response?.data?.message);
            setLoading(false);
        });
    }, []);

    const filteredProducts = []
   
    products?.map(product => {
        if (selectedCategory && product.category !== selectedCategory?.label) return
        filteredProducts?.push(product)
    })

    const columns = [
        { title: "Product Name", field: "name", width: "2%" },
        { title: "Quantity", field: "quantity" },
        { title: "Unit Price", field: "unitPrice", render: rowData => numberFormatter.format(rowData?.unitPrice) },
        { title: "Sale Price", field: "salePrice", render: rowData => numberFormatter.format(rowData?.salePrice) },
        { title: "Total Cost", field: "totalCost", render: rowData => numberFormatter.format(rowData?.totalCost) },
    ];

    const handlePrint = useReactToPrint({
        content: () => document.querySelector('.printable-table'),
    });

    let totalCost = 0;
    let totalQuantity = 0
    products?.map(product => {
        if (selectedCategory && product.category !== selectedCategory?.label) return
        totalCost += product?.totalCost;
        if (product?.quantity < 0) return
        totalQuantity += product.quantity
    });

    return (
        <div style={{
            background: "white",
            borderRadius: "8px",
            padding: "30px 50px",
            display: "flex",
            gap: "30px",
            flexDirection: "column",
            width: "100%"
        }}>
            <PrintableTableComponent columns={columns} data={products} imageUrl={imageUrl} 
                reportTitle="Product Stock Report">
            </PrintableTableComponent>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <Typography style={{
                        fontWeight: "bold",
                        fontSize: "20px"
                    }}> Stock Summary</Typography>
                    <Typography style={{
                        fontSize: "18px",
                        color: "#6C6C6C"
                    }}> {loading ? 'Loading...' : (products.length > 0 ? `${products.length} products - ${totalQuantity} items` : 'No data')}</Typography>
                </div>
                <CustomButton text="Print" onClick={handlePrint} height="35px" fontSize="14px" />

                <Select
                    placeholder="Select Store"
                    options={Array.from(new Set(allProducts.map(product => product.category))).map(category => ({ value: category, label: category }))}
                    onChange={selectedOption => setSelectedCategory(selectedOption)}
                    isClearable={true}
                    isSearchable={true}
                    style={{ width: '300px' }}
                />

                <Typography style={{
                    fontWeight: "bold",
                    fontSize: "20px"
                }}> ${numberFormatter.format(totalCost)}</Typography>
            </div>
            <StockTable columns={columns}
                        kind="Report"
                        data={filteredProducts}
                        way="summary"
                        state={loading ? loading : "no data to display"}
            />
        </div>
    );
}

export default StockSummary;
