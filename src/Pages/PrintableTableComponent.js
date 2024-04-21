import React from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import profile from "../assets/images/blueProfile.webp";
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useReactToPrint } from 'react-to-print';

const PrintableTableComponent = ({ columns, data, imageUrl }) => {
   
    return (
        <div className="printable-table" style={{ padding: "20px",}}>

            <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                <div>
                    <Typography style={{ fontSize: "20px", fontWeight: "bold" }}> DIRHAM COSMETICS COMPANY</Typography>
                    <Typography style={{ fontSize: "18px" }}> bakaaro - 0616549198</Typography>
                </div>

                <div style={{ width: "100px", height: "100px", background: "transparent" }}>
                    <img
                        src={imageUrl || profile}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center" }}>
                <MdKeyboardArrowRight style={{ fontSize: "18px" }} />
                <Typography style={{ fontSize: "16px" }}> Customer Report</Typography>
            </div>
            <MaterialTable
                title="Printable Table"
                columns={columns}
                data={data}
                options={{
                    pageSize: 40,
                    paging: false,
                    toolbar: false,
                    showTitle: false,
                    headerStyle: { fontWeight: "bold", background: "lightgray" }
                }}
                style={{ boxShadow: "none", border: "1px solid gray", marginTop: "20px" }}
            />
            {/* <div className='print-footer'> BOOKTIRE SYSTEM FOR BUSINESS</div> */}

            <div style = {{marginRight: "auto"}}>
                <Typography> Number Of Customers: 355</Typography>
                <Typography> Total Amount: $545</Typography>
            </div>
        </div>
    );
};

const YourComponent = () => {
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/deentire-application.appspot.com/o/LOGO%2Fliibaan.jpeg?alt=media&token=f5b0b3e7-a5e0-4e0d-b3d2-20a920f97fde`;
    const columns = [
        { title: 'Name', field: 'name' },
        { title: 'Surname', field: 'surname' },
        { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
        { title: 'Birth Place', field: 'birthCity', lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' } },
    ];

    const data = Array.from({ length: 90 }, (_, index) => ({
        name: `Name ${index + 1}`,
        surname: `Surname ${index + 1}`,
        birthYear: 1980 + index,
        birthCity: index % 2 === 0 ? 34 : 63
    }));

    const handlePrint = useReactToPrint({
        content: () => document.querySelector('.printable-table'),
    });

    return (
        <div>
            <button onClick={handlePrint}>Print</button>
            <PrintableTableComponent columns={columns} data={data} imageUrl={imageUrl}/>
        </div>
    );
};

export default PrintableTableComponent;
