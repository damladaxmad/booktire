import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import Modal from "../Modal/Modal";
import { constants } from "../Helpers/constantsFile";
import { useSelector } from "react-redux";
import CustomButton from "../reusables/CustomButton";

const Register = ({instance, store, name, fields, update, url, business,
hideModal, onUpdate}) => {

  const filteredFields = fields.filter(field => !(update && name === "User" && field.name === "password"));
  const [disabled, setDisabled] = useState(false)
  const token = useSelector(state => state.login.token)
  const mySocketId = useSelector(state => state?.login?.mySocketId)
  const validate = (values) => {
    const errors = {};

     if (!values.name) {
       errors.name = "Field is Required";
     }
     if ( name !== "User" && !values.phone) {
       errors.phone = "Field is Required";
     }
  

    return errors;
  };

  const formik = useFormik({
    initialValues: {
        name: update ? instance?.name : "",
        phone: update ? instance?.phone : "",
        district: update ? instance?.district : "",
        username: update && name == "User" ? instance?.username : "",
        role: update && name == "User" ? instance?.role : ""
    },
    validate,
    onSubmit: (values,  ) => {
      setDisabled(true)
      values.business = business
      values.socketId = mySocketId
      if (name === "User") values.passwordConfirm = values.password

      if (update){
        axios.patch(`${constants.baseUrl}/${url}/${instance._id}`, values,
        {
          headers: {
            "authorization": token
          }
        }).then((res) => {
          setDisabled(false)
          hideModal()
          onUpdate(res?.data?.data)
        }).catch((err) => {
          setDisabled(false)
          alert(err.response?.data?.message);
        });
      } else {
        
        axios.post(`${constants.baseUrl}/${url}`, values,
        {
          headers: {
            "authorization": token
          }
        }).then((res) => {
          setDisabled(false)
          hideModal()
          store(res?.data?.data)
        }).catch((err) => {
          setDisabled(false)
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
          gap: "5px"
        }}
      >
        <h2>{update ? `${name} Update` : `${name} Creation`}</h2>
     

        <form
        onSubmit={formik.handleSubmit}
        style={{ display: "flex", gap: "16px",
      flexDirection: name == "Expense" ? "row" : "column", alignItems: "center",
    flexWrap: name == "Expense" ? "wrap" : "nowrap" }}
      >
        {filteredFields?.map((a, index) => (
          <div key = {index}>
            <input
              // variant="outlined"
              label={a.label}
              placeholder={a.label}
              id={a.name}
              name={a.name}
              type={a.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[a.name]}
              style={{ width: "290px", color: "black",
              padding: "10px", borderRadius: "5px", height: "40px",
              border: "1px solid lightGrey", }}
              key={index}
            />
            {formik.touched[a.name] && formik.errors[a.name] ? (
              <div style={{ color: "red" }}>{formik.errors[a.name]}</div>
            ) : null}
          </div>
        ))}

       <CustomButton 
       disabled={disabled}
       type = "submit"
       width = "290px"
       bgColor={constants.pColor}
       text = {update ? `Update ${name}` : `Create ${name}`}
       style = {{marginBottom: "8px"}}
       />
      </form>

      </div>
    </Modal>
  );
};

export default Register;
