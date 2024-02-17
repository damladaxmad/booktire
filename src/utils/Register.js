import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { TextField, Button, FormControl, MenuItem } from "@mui/material";
import {AiOutlinePlus} from "react-icons/ai"
import Modal from "../Modal/Modal";
import { constants } from "../Helpers/constantsFile";
import { useSelector } from "react-redux";
import CustomButton from "../reusables/CustomButton";

const Register = ({instance, store, name, fields, update, url, business,
hideModal, onUpdate}) => {

  const token = useSelector(state => state.login.token)

  const validate = (values) => {
    const errors = {};

     if (!values.name) {
       errors.name = "Field is Required";
     }
     if (!values.phone) {
       errors.phone = "Field is Required";
     }
  

    return errors;
  };

  const formik = useFormik({
    initialValues:{
        name: update ? instance?.name : "",
        phone: update ? instance?.phone : "",
        district: update ? instance?.district : "",
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      values.business = business
      if (update){
        axios.patch(`${constants.baseUrl}/${url}/${instance._id}`, values,
        {
          headers: {
            "authorization": token
          }
        }).then((res) => {
          alert("Successfully Updated")
          hideModal()
          onUpdate(res?.data?.data)
        }).catch((err) => {
          alert(err.response?.data?.message);
        });
      } else {
        
        axios.post(`${constants.baseUrl}/${url}`, values,
        {
          headers: {
            "authorization": token
          }
        }).then((res) => {
          hideModal()
          store(res?.data?.data)
        }).catch((err) => {
          alert(err.response.data.message);
        });
      }    
    
    },
  });

 
  return (
    <Modal onClose = {hideModal} pwidth = {"450px"}
    left = {name == "Expense" ? "32%" : "38%"} top = "22%">
       <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "15px"
        }}
      >
        <h2>{update ? `${name} Update` : `${name} Creation`}</h2>
     

        <form
        onSubmit={formik.handleSubmit}
        style={{ display: "flex", gap: "16px",
      flexDirection: name == "Expense" ? "row" : "column", alignItems: "center",
    flexWrap: name == "Expense" ? "wrap" : "nowrap" }}
      >
        {fields?.map((a, index) => (
          <div>
            <TextField
              variant="outlined"
              label={a.label}
              id={a.name}
              name={a.name}
              type={a.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[a.name]}
              style={{ width: "290px", color: "black" }}
              key={index}
            />
            {formik.touched[a.name] && formik.errors[a.name] ? (
              <div style={{ color: "red" }}>{formik.errors[a.name]}</div>
            ) : null}
          </div>
        ))}

       <CustomButton 
       type = "submit"
       width = "290px"
       bgColor={constants.pColor}
       text = {update ? `Update ${name}` : `Create ${name}`}/>
      </form>

      </div>
    </Modal>
  );
};

export default Register;
