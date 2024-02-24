import Modal from "../../Modal/Modal";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import axios from "axios";
import { constants } from "../../Helpers/constantsFile";
import CustomButton from "../../reusables/CustomButton";
import { Typography } from "@material-ui/core";

const ChangePassword = ({ user, logoutHandler, hideModal }) => {

    const [disabled, setDisabled] = useState(false)
    const token = useSelector(state => state.login.token)

    const arr = [
        { label: "Geli Pin-ki hore", type: "text", name: "currentPassword" },
        { label: "Geli Pin-ka cusub", type: "text", name: "newPassword" },
        { label: "Ku celi pin-ka cusub", type: "text", name: "affirm" },
    ];

    const validate = (values) => {
        const errors = {};

        if (!values.currentPassword) {
            errors.currentPassword = "Field is Required";
        }

        if (!values.newPassword) {
            errors.newPassword = "Field is Required";
        }
        if (!values.affirm) {
            errors.affirm = "Field is Required";
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            affirm: "",
        },
        validate,
        onSubmit: (values, { resetForm }) => {
            setDisabled(true)
            if (values.newPassword !== values.affirm) {
                alert("Isma laha labada password")
                setDisabled(false)
                return
            }
            console.log(values)
            axios.post(`${constants.baseUrl}/users/change-password/${user._id}`, {
                passwordCurrent: values.currentPassword,
                password: values.newPassword,
                passwordConfirm: values.affirm
            }, {
                headers: {
                    authorization: token
                }
            }).then((res) => {
                setDisabled(false)
                alert("Waa la badalay Pin-ka")
                logoutHandler()
                hideModal();
                resetForm();
            }).catch((err) => {
                alert(err?.response?.data?.message);
                setDisabled(false)
            });

        },
    });


    return (
        <Modal onClose={() => hideModal()} pwidth="450px" top="26%">
            <div
                style={{
                    display: "flex",
                    width: "410px",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "15px",
                    padding: "10px"
                }}
            >
                <Typography style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    marginBottom: "10px"
                }}>BEDEL PIN-KA </Typography>


                <form
                    onSubmit={formik.handleSubmit}
                    style={{
                        display: "flex", gap: "16px",
                        flexDirection: "column", alignItems: "center"
                    }}
                >
                    {arr.map((a, index) => (
                        <div>
                            <input
                                autoComplete="off"
                                variant="outlined"
                                label={a.label}
                                id={a.name}
                                placeholder={a.label}
                                name={a.name}
                                type={a.type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values[a.name]}
                                style={{
                                    width: "310px", color: "black", borderRadius: "8px",
                                    height: "50px", padding: "15px", border: "1.5px solid lightGray"
                                }}
                                key={index}
                            />
                            {formik.touched[a.name] && formik.errors[a.name] ? (
                                <div style={{ color: "red" }}>{formik.errors[a.name]}</div>
                            ) : null}
                        </div>
                    ))}

                    <CustomButton
                        type="submit"
                        disabled={disabled}
                        width="310px"
                        height="45px"
                        fontSize="16px"
                        bgColor={constants.pColor}
                        text="Bedel Pin-ka"
                    />
                </form>

            </div>
        </Modal>
    );
};

export default ChangePassword;
