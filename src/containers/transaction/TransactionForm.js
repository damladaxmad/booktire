import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import MyModal from "../../Modal/Modal"
import { useDispatch, useSelector } from "react-redux";
import { constants } from "../../Helpers/constantsFile";
import { Button, Typography } from "@material-ui/core";
import moment from "moment";
import { deleteFunction } from "../../funcrions/deleteStuff";
import CustomButton from "../../reusables/CustomButton";
import { addTransaction, deleteTransaction, updateTransaction } from "./transactionSlice";
import { updateCustomerBalance } from "../customer/customerSlice";
import { handleAddCustomerBalance, handleDeleteCustomerBalance, handleUpdateCustomerBalance } from "../customer/customerUtils";

const TransactionForm = ({ type, update, instance, transaction, client, hideModal }) => {

    const [disabled, setDisabled] = useState(false)
    const token = useSelector(state => state.login.token)
    const mySocketId = useSelector(state => state?.login?.mySocketId)
    const { name } = useSelector(state => state.login.activeUser)
    const today = new Date();
    const transactions = JSON.parse(JSON.stringify(useSelector(state => state.transactions.transactions)))
    const dispatch = useDispatch()

    const calculateBalance = (transactions) => {
        let balance = 0;
        transactions.forEach(transaction => {
            balance += transaction.debit - transaction.credit;
        });
        return balance;
    };


    const arr = type == "bixin" ? [
        { label: "Geli Lacagta", type: "number", name: "credit" },
        { label: "Geli Faahfaahin", type: "text", name: "description" },
        { label: "", type: "date", name: "date" },
    ] :
        [
            { label: "Geli Lacagta", type: "number", name: "debit" },
            { label: "Geli Faahfaahin", type: "text", name: "description" },
            { label: "", type: "date", name: "date" },
        ];

    const deleteTransactionFun = () => {
        deleteFunction(
            true,
            `Delete Transaction`,
            transaction?.description,
            `${constants.baseUrl}/transactions/${transaction?._id}`,
            token,
            (res) => {
                handleDeleteCustomerBalance(dispatch, transactions, calculateBalance, res);
                dispatch(deleteTransaction(transaction?._id))
                hideModal()

            }
        )
    };

    const errorStyle = { color: "red", marginLeft: "27px", fontSize: "16px" }

    const validate = (values) => {
        const errors = {};

        if (!values.debit && type == "deen") {
            errors.debit = "Field is Required";
        }
        if (!values.credit && type == "bixin") {
            errors.credit = "Field is Required";
        }
        if (!values.description && type == "deen") {
            errors.description = "Field is Required";
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            description: update ? transaction.description : "",
            debit: update ? transaction?.debit : "",
            credit: update ? transaction.credit : "",
            date: update ? moment(transaction.date).format("YYYY-MM-DD") :
                moment(today).format("YYYY-MM-DD")
        },
        validate,
        onSubmit: async (values, { resetForm }) => {
            //    values.socketId = socket
            type == "bixin" ? values.debit = 0 : values.credit = 0
            values.description = values.description || "Payment";
            values[client] = instance?._id
            values.user = name
            values.socketId = mySocketId
            setDisabled(true)

            if (update) {
                const res = await axios.patch(`${constants.baseUrl}/transactions/${transaction?._id}`, values,
                    {
                        headers: {
                            "authorization": token
                        }
                    }).then((res) => {
                        dispatch(updateTransaction({
                            id: transaction._id,
                            updatedTransaction: res?.data?.data?.transaction
                        }));
                        let response = res?.data?.data?.transaction
                        handleUpdateCustomerBalance(dispatch, transactions, calculateBalance, response);
                        hideModal();
                    }
                    ).catch((err) => {
                        alert(err.response.data.message);
                        setDisabled(false)
                    }
                    )
            }

            else {
                const res = await axios.post(`${constants.baseUrl}/transactions`, values,
                    {
                        headers: {
                            "authorization": token
                        }
                    }).then((res) => {
                        setDisabled(false);
                        dispatch(addTransaction(res?.data?.data?.transaction));
                        let response = res?.data?.data?.transaction
                        handleAddCustomerBalance(dispatch, transactions, calculateBalance, response);
                        hideModal();
                    }
                    ).catch((err) => {
                        alert(err.response?.data?.message);
                        setDisabled(false)
                    }
                    )
            }

        },
    });

    return (
        <MyModal onClose={hideModal} width="300px" top="30%">
            <form
                onSubmit={formik.handleSubmit}
                style={{
                    display: "flex", gap: "12px", flexWrap: "wrap",
                    justifyContent: "center", flexDirection: "column", width: "380px",
                    padding: "16px 0px",
                    alignItems: "center"
                }}
            >
                {!update && <Typography style={{
                    fontSize: "22px", fontWeight: "bold",
                    marginBottom: "5px"
                }}> {type == "deen" ? "DEEN CUSUB FORM" : "PAYMENT FORM"}</Typography>}
                {update &&
                    <div style={{
                        display: "flex", width: "300px", justifyContent: "space-between",
                        alignItems: "end", marginBottom: "10px"
                    }}>

                        <Button style={{
                            width: "120px",
                            padding: "0px 5px",
                            fontSize: "16px",
                            backgroundColor: "#F03E06",
                            fontWeight: "600",
                            marginLeft: "auto",
                            color: "white",
                            height: "35px",
                            border: "none",
                            marginTop: "5px",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                            onClick={() => deleteTransactionFun()}>
                            Delete
                        </Button>
                    </div>}

                {arr.map((a, index) => (
                    <div key={index}>
                        <input
                            placeholder={a.label}
                            id={a.name}
                            name={a.name}
                            type={a.type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values[a.name]}
                            style={{
                                width: "300px",
                                height: "45px",
                                padding: "15px",
                                fontSize: "16px",
                                border: "1px solid grey",
                                borderRadius: "5px",
                            }}
                            key={index}
                        />
                        {formik.touched[a.name] && formik.errors[a.name] ? (
                            <div style={{ color: "red" }}>{formik.errors[a.name]}</div>
                        ) : null}
                    </div>
                ))}
                <CustomButton bgColor={constants.pColor}
                    disabled={disabled}
                    text={update ? "UPDATE" : "XAREY"}
                    type="submit" width="300px"
                />


            </form>
        </MyModal>
    );
};

export default TransactionForm;
