import React from 'react';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import './POSPrintableComponent.css';

const POSPrintableComponent = ({ reportTitle, columns, data, date, discount, subtotal, total }) => {
    const { business } = useSelector(state => state.login?.activeUser);

    return (
        <div className="pos-printable">
            <div className="pos-header">
                <Typography className="pos-business-name" style = {{fontWeight:"bold"}}>{business?.businessName}</Typography>
                <Typography className="pos-business-info">Bakaaro - {business?.businessNumber}</Typography>
                <Typography className="pos-report-title" style = {{marginTop: "7px"}}>{reportTitle} #04</Typography>
                <Typography className="pos-date">Date: {date}</Typography>
            </div>

            <table className="pos-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.field}>{column.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {columns.map((column) => (
                                <td key={column.field}>{row[column.field]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pos-summary">
                <div className="pos-summary-row">
                    <span>Subtotal:</span>
                    <span>${subtotal}</span>
                </div>
                <div className="pos-summary-row">
                    <span>Discount:</span>
                    <span>${discount}</span>
                </div>
                <div className="pos-summary-row pos-total">
                    <span>Total:</span>
                    <span>${subtotal - discount}</span>
                </div>
            </div>

            <div className="pos-footer">
                <Typography className="pos-footer-text"> &copy; Booktire By Tacabtire Ict</Typography>
            </div>
        </div>
    );
};

export default POSPrintableComponent;
