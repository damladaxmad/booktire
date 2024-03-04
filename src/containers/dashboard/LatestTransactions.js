import { Typography } from "@mui/material"
import { constants } from "../../Helpers/constantsFile"

export default function LatestTransactions() {

    const data = [
        { name: "Apple Phones", date: "2024/2/27", total: 200 },
        { name: "Apple Phone", date: "2024/2/27", total: 200 },
        { name: "Apple Phone", date: "2024/2/27", total: 200 },
        { name: "Apple Phone", date: "2024/2/27", total: 200 },
        { name: "Apple Phone", date: "2024/2/27", total: 200 },
    ]

    return (
        <div style={{
            marginTop: "15px", display: "flex", flexDirection: "column",
            gap: "16px", width: "100%"
        }}>
            {data?.map((d, index) => {
                return <Transaction data={d} index = {index} />
            })}

        </div>
    )
}

function Transaction({ data, index }) {
    return (
        <div style={{
            display: "flex", flexDirection: "row", width: "100%",
            background: index == 0 ? constants.pColor : "white", borderRadius: "8px", padding: "15px 20px",
            alignItems: "center", justifyContent: "space-between",
            color: index == 0 ? "white" : "black", position: "relative"
        }}>

            <div style={{
                position: 'absolute', top: "20%", bottom: "20%", left: 0, width: '6px',
                backgroundColor: index == 0 ? "white" : '#C8C8C8',
                borderRadius: "0px 6px 6px 0px"
            }}></div>

            <div style={{ display: "flex", flexDirection: "column", }}>
                <Typography style={{ fontSize: "15px", fontWeight: "bold" }}> {data.name}</Typography>
                <Typography style={{ fontSize: "14px", color: 
                index == 0 ? "#EAD8F8" : "#B4B4B4" }}> {data.date}</Typography>
            </div>
            <Typography style={{ fontSize: "15px" }}> invoice sale</Typography>
            <Typography style={{ fontSize: "15px" }}> ${data.total}</Typography>
        </div>
    )
}