import React, { useEffect, useState } from "react";
import { Typography, TextField, CircularProgress } from "@material-ui/core";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import CustomButton from "../../reusables/CustomButton";
import { constants } from "../../Helpers/constantsFile";
import MaterialTable from "material-table";
import SalesDetailsModal from "./SalesDetailsModal";
import { setUserDataFetched, setUsers } from "../user/userSlice";
import Select from "react-select";
import useReadData from "../../hooks/useReadData";

export default function SalesSummary() {
    const token = useSelector(state => state?.login?.token);
    const { business } = useSelector(state => state.login.activeUser);
    const user = useSelector(state => state.login.activeUser);
    const [sales, setSales] = useState([]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // Track selected user
    const userUrl = `${constants.baseUrl}/users/get-business-users/${business?._id}`;
    const users = useSelector(state => state.users.users);

    const numberFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    useReadData(
        userUrl,
        setUsers,
        setUserDataFetched,
        state => state.users.isUsersDataFetched,
        "users"
    );

    const fetchSales = () => {
        setLoading(true);
        axios.get(`${constants.baseUrl}/sales/get-business-sales-summary/${business?._id}?startDate=${moment(startDate).format("YYYY-MM-DD")}&endDate=${moment(endDate).format("YYYY-MM-DD")}`, {
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

    const handleSalesNumberClick = (sale) => {
        setSelectedSale(sale);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedSale(null);
    };

    const filteredSales = selectedUser
        ? sales.filter(sale => sale?.user === selectedUser?.label)
        : sales;

    console.log(sales)

    return (
        <div style={{ width: "97.5%", marginTop: "30px" }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <TextField
                    size="small"
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
                    size="small"
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

                <CustomButton text="View" height="37px" width="100px" fontSize="14px"
                style = {{marginLeft: "20px"}}
                onClick={handleViewClick} />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: "10px" }}>
                    <CircularProgress />
                </div>
            ) : (
                <MaterialTable
                    title="Sales Report"
                    columns={[
                       
                        { title: 'Name', field: 'name', width: "8%", cellStyle: {whiteSpace: "nowrap"} },
                        { title: 'Quantity', field: 'totalQuantity' },
                        { title: 'Descriptoin', field: 'description' },
                        { title: 'Cost', field: 'totalCostOfGoodsSold', render: rowData => <p>${numberFormatter.format(rowData?.totalCostOfGoodsSold)}</p> },
                        { title: 'Profit', field: 'profit', render: rowData => <p>${numberFormatter.format(rowData?.profit)}</p> },
                        { title: 'Total', field: 'totalPrice', render: rowData => <p>${numberFormatter.format(rowData?.totalPrice)}</p> },
                        { title: 'Available', field: 'available' },
                        ]}
                    data={filteredSales?.map((sale, index) => ({
                        name: sale.name,
                        totalQuantity: sale.totalQuantity,
                        description: sale.description,
                        totalCostOfGoodsSold: sale.totalCostOfGoodsSold,
                        profit: sale.profit,
                        totalPrice: sale.totalPrice,
                        available: sale.available

                    }))}
                    options={{
                        search: false,
                        paging: false,
                        toolbar: false,
                        headerStyle: { fontWeight: "bold" },
                        rowStyle: (rowData) => {
                            return {
                                backgroundColor: rowData?.customer && "#EDD3FF",
                                borderBottom: rowData?.customer ? "1px solid grey" : "1px solid #A6A6A6",
                            };
                        },
                    }}
                    style={{ marginTop: "20px", boxShadow: "none", width: "100%", zIndex: 0 }}
                />
            )}

         
        </div>
    );
}

