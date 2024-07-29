import { Typography } from "@material-ui/core"
import { useSelector } from "react-redux"
import MyTable from "../../utils/MyTable"
import PrintableTableComponent from "./PintableTableComponent"
import { useReactToPrint } from 'react-to-print';
import CustomButton from "../../reusables/CustomButton";
import { setCustomerDataFetched, setCustomers } from "../customer/customerSlice";
import useReadData from "../../hooks/useReadData";
import { constants } from "../../Helpers/constantsFile";

const PersonalReport = ({name, type}) => {

    const customers = JSON.parse(JSON.stringify(useSelector(state => state.customers.customers)))
    const vendors = JSON.parse(JSON.stringify(useSelector(state => state.vendors.vendors)))
    const { business } = useSelector(state => state.login.activeUser);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/deentire-application.appspot.com/o/LOGO%2Fliibaan.jpeg?alt=media&token=f5b0b3e7-a5e0-4e0d-b3d2-20a920f97fde`;
    const urlCustomer = `${constants.baseUrl}/customers/get-business-customers/${business?._id}`;

    const numberFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    useReadData(
      urlCustomer,
      setCustomers,
      setCustomerDataFetched,
      state => state.customers.isCustomerDataFetched,
      "customers"
    );
    let customerTotal = 0
    let vendorTotal = 0

    let realCustomers = []
    customers?.map(customer => {
        if (!customer?.type || customer?.type == "deynle")
        if (customer.balance > 0) {
        realCustomers.push(customer)
        customerTotal += customer.balance
        }
    })


    let realVendors = []
    vendors?.map(vendor => {
        if (vendor.balance > 0){
        realVendors.push(vendor)
        vendorTotal += vendor.balance
        }
    })

    const decideTotal = () => {
        if (type == "Customers") return customerTotal
        if (type == "Vendors") return vendorTotal
        return 0
    }
    const decideCount = () => {
        if (type == "Customers") return realCustomers?.length
        if (type == "Vendors") return realVendors?.length
        return 0
    }

    const columns = [
        { title: "Full Name", field: "name", width: "4%" },
        { title: "Phone Number", field: "phone" },
        { title: "Address", field: "district" },
        { title: "Balance", field: "balance", render: rowData => <p> {numberFormatter.format(rowData?.balance)}</p> },
    ]

    const handlePrint = useReactToPrint({
        content: () => document.querySelector('.printable-table'),
    });

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

            <PrintableTableComponent columns={columns} data={type == "Customers" ? realCustomers : realVendors} imageUrl={imageUrl} 
            reportTitle = {`${type} Report`}> 
               <div style = {{marginTop: "10px"}}>  
                <Typography style = {{ fontSize: "16px"}}>  TOTAL: 
                <span  style = {{fontWeight: "bold", fontSize: "18px"}}> {numberFormatter.format(decideTotal())} </span></Typography>
            </div>
            </PrintableTableComponent>
            <div style = {{display: "flex", justifyContent: "space-between"}}>
            <div>
                <Typography style = {{
                    fontWeight: "bold",
                    fontSize: "20px"
                }}> {type} Report</Typography>
                <Typography style = {{
                    fontSize: "18px",
                    color: "#6C6C6C"
                }}> {decideCount()} {name}</Typography>
            </div>
            
            <CustomButton text = "Print" onClick={handlePrint} height="35px" fontSize="14px"/>

            <Typography style = {{
                    fontWeight: "bold",
                    fontSize: "20px"
                }}> {numberFormatter.format(decideTotal())}</Typography>
            </div>
           
           {name == "customers" && <MyTable columns = {columns} data = {realCustomers}
            kind = "Report"/>}
           {name == "vendors" && <MyTable columns = {columns} data = {realVendors}
            kind = "Report"/>}

        </div>
    )
}

export default PersonalReport