import React from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import profile from "../../assets/images/blueProfile.webp";
import { MdKeyboardArrowRight } from 'react-icons/md';
import "./PrintableTable.css"
import { useSelector } from 'react-redux';

const PrintableTableComponent = ({reportTitle, columns, data, imageUrl, children }) => {

    const {business} = useSelector(state => state.login?.activeUser)
   
    return (
        <div className="printable-table" style={{ padding: "15px 20px",}}>

            <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                <div>
                    <Typography style={{ fontSize: "20px", fontWeight: "bold" }}> {business?.businessName}</Typography>
                    <Typography style={{ fontSize: "18px" }}> bakaaro - {business?.businessNumber}</Typography>
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

            <div style={{ display: "flex", flexDirection: "row", gap: "6px", alignItems: "center" }}>
                <MdKeyboardArrowRight style={{ fontSize: "18px" }} />
                <Typography style={{ fontSize: "16px" }}> {reportTitle}</Typography>
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
                style={{ boxShadow: "none", border: "1px solid gray", marginTop: "15px" }}
            />
            {/* <div className='print-footer'> BOOKTIRE SYSTEM FOR BUSINESS</div> */}

           {children}
        </div>
    );
};

export default PrintableTableComponent