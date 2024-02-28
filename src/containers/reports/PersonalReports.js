import { Typography } from "@material-ui/core"
import { useSelector } from "react-redux"
import MyTable from "../../utils/MyTable"
const PersonalReport = ({name, type}) => {

    const customers = JSON.parse(JSON.stringify(useSelector(state => state.customers.customers)))
    const vendors = JSON.parse(JSON.stringify(useSelector(state => state.vendors.vendors)))

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
        { title: "Balance", field: "balance" },
    ]

    return (
        <div style = {{
            background: "white",
            borderRadius: "8px",
            padding: "20px 30px",
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
                }}> {type} Report</Typography>
                <Typography style = {{
                    fontSize: "18px",
                    color: "#6C6C6C"
                }}> {decideCount()} {name}</Typography>
            </div>
            <Typography style = {{
                    fontWeight: "bold",
                    fontSize: "20px"
                }}> ${decideTotal().toFixed(2)}</Typography>
            </div>
           
           {name == "customers" && <MyTable columns = {columns} data = {realCustomers}
            kind = "Report"/>}
           {name == "vendors" && <MyTable columns = {columns} data = {realVendors}
            kind = "Report"/>}

        </div>
    )
}

export default PersonalReport