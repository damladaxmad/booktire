import Modal from "../../Modal/Modal";
import { Button, Divider, Typography  } from "@material-ui/core";
import {TextField, Select} from "@mui/material"
import React, { useState } from "react";
import { FormControl, MenuItem } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import axios from "axios";
import { constants } from "../../Helpers/constantsFile";
import { setActiveUser } from "../../SignupAndLogin/loginSlice";
import CustomButton from "../../reusables/CustomButton";

const EditProfile = (props) => {

  const [disabled, setDisabled] = useState(false)
  const token = useSelector(state => state.login.token)

  const arr = [
    { label: "Enter Name", type: "text", name: "name" },
    { label: "Enter username", type: "text", name: "username" }
  ];

  const dispatch = useDispatch()
  
  const isPreviousValid = (password) => {
    if (props.user.password == password) return true
    return false
  }

  const validate = (values) => {
    const errors = {};
   
    // if (!values.username) {
    //   errors.username = "Field is Required";
    // }

    // if (!values.password) {
    //   errors.password = "Field is Required";
    // }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      username: props.user.username,
      phone: props.user?.phone,
      name: props.user.name
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      setDisabled(true)
        axios.patch(`${constants.baseUrl}/users/${props.user._id}`, values, {
          headers: {
            authorization: token
          }
        }).then((res) => {
             alert("Successfully Updated")
             props.logoutHandler()
             dispatch(setActiveUser(res.data?.data?.user))
             setDisabled(false)
             props.hideModal();  
             resetForm();
        }).catch((err)=> {
          alert(err.response.data.message);
          setDisabled(false)
          console.log(values)
        });
    
    },
  });

 
  return (
    <Modal onClose = {()=> props.hideModal() } pwidth = "450px" top = "26%">
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
        <Typography style = {{
          fontWeight:"bold",
          fontSize: "20px",
          marginBottom: "10px"
        }}>RESET ACCOUNT </Typography>
     

        <form
        onSubmit={formik.handleSubmit}
        style={{ display: "flex", gap: "16px",
      flexDirection: "column", alignItems: "center" }}
      >
        {arr.map((a, index) => (
          <div>
            <input
              autoComplete="off"
              variant="outlined"
              label={a.label}
              id={a.name}
              placeholder = {a.label}
              name={a.name}
              type={a.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[a.name]}
              style={{ width: "310px", color: "black", borderRadius: "8px",
              height: "50px", padding: "15px", border: "1.5px solid lightGray" }}
              key={index}
            />
            {formik.touched[a.name] && formik.errors[a.name] ? (
              <div style={{ color: "red" }}>{formik.errors[a.name]}</div>
            ) : null}
          </div>
        ))}
  

        <CustomButton
        type = "submit"
        disabled={disabled}
        width = "310px"
        height= "45px"
        fontSize= "16px"
        bgColor={constants.pColor}
        text = "Update User"
        />
      </form>

      </div>
    </Modal>
  );
};

export default EditProfile;
