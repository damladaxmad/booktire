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
import { addTransaction, updateTransaction } from "./transactionSlice";

const TransactionForm = ({ type, update, instance, transaction, hideModal }) => {

    const token = useSelector(state => state.login.token)
    const {name} = useSelector(state => state.login.activeUser)
    const [disabled, setDisabled] = useState(false)
    const today = new Date();

    const dispatch = useDispatch()

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

    const deleteTransaction = async () => {
        await deleteFunction(
            `Delete Transaction`,
            transaction?.description,
            `${constants.baseUrl}/transactions/${transaction?._id}`,
            token,
            () => { 
                dispatch(deleteTransaction(transaction?._id))
                hideModal()
             },
        );
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
            values.customer = instance?._id
            values.user = name
            setDisabled(true)

            if (update) {
                const res = await axios.patch(`${constants.baseUrl}/transactions/${transaction?._id}`, values,
                    {
                        headers: {
                            "authorization": token
                        }
                    }).then((res) => {
                        console.log(transaction)
                        console.log(res?.data?.data)
                        dispatch(updateTransaction({
                            id: transaction._id,
                            updatedTransaction: res?.data?.data?.transaction
                          }));
                        hideModal()
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
                        setDisabled(false)
                        dispatch(addTransaction(res?.data?.response?.data?.transaction[0]))
                        hideModal()
                    }
                    ).catch((err) => {
                        alert(err.response.data.message);
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
                            width: "100px",
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
                            onClick={() => deleteTransaction()}>
                            DELETE
                        </Button>
                    </div>}

                {arr.map((a, index) => (
                    <div>
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
                                height: "40px",
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
                    disabled = {disabled}
                    text={update ? "UPDATE" : "XAREY"}
                    type="submit" width="300px"
                />


            </form>
        </MyModal>
    );
};

export default TransactionForm;
