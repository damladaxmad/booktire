import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { constants } from "../Helpers/constantsFile";
import { setActiveUser, setIsLogin, setToken } from "./loginSlice";
import CustomButton from "../reusables/CustomButton";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Login = (props) => {
  const dispatch = useDispatch()
  const classes=useStyles();
  const [showSpinner, setShowSpinner] = useState(false)
  const [stateValues, setStateValues] = useState("")
  const [usernameOrPasswordError, setUsernameOrPasswordError] = useState('')

  const loginArr = [
    { label: "Enter Username", type: "text", name: "userName" },
    { label: "Enter Password", type: "password", name: "password" },
  ];

  const errorStyle = { color: "red", marginLeft: "27px", fontSize: "16px"}

  const validate = (values) => {
    const errors = {};

    if (!values.userName) {
      errors.userName = "Field is Required";
    }

    if (!values.password) {
      errors.password = "Field is Required";
    }
    return errors;
  };

  const authenticateFun = async (values) => {
  
    const response = await axios
    .post(`${constants.baseUrl}/users/authenticate`, {
      username: values.userName,
      password: values.password,
      version: "notify_version"
    }
    ).then(res => {
      dispatch(setActiveUser(res.data?.data?.user))
      dispatch(setToken(`Bearer ${res?.data?.token}`))
      dispatch(setIsLogin(true))
      setShowSpinner(false)
      props.showHandler(res.data?.data?.user)
    })
    .catch((err) => {
      setShowSpinner(false)
      setUsernameOrPasswordError(err.response?.data?.message)
    });
  }

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validate,
    onSubmit: async (values, { resetForm }) =>  {
      setShowSpinner(true)
      setStateValues(values)
    },
  });

  useEffect(()=> {
      if (stateValues != "") authenticateFun(stateValues)
    
  }, [stateValues])


  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ display: "flex", gap: "16px", flexWrap: "wrap",
      justifyContent: "center"
     }}
    >
      {loginArr.map((a, index) => (
        <div key = {index}>
      {showSpinner && <Backdrop className={classes.backdrop} open>
        <CircularProgress color="inherit" />
      </Backdrop>}
          <input
            placeholder={a.label}
            id={a.name}
            name={a.name}
            type={a.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[a.name]}
            style={{
              width: "290px",
              height: "45px",
              padding: "15px",
              fontSize: "16px",
              border: "1.5px solid grey",
              borderRadius: "6px",
            }}
            key={index}
          />
          {formik.touched[a.name] && formik.errors[a.name] ? (
            <div style={{ color: "red" }}>{formik.errors[a.name]}</div>
          ) : null}
        </div>
      ))}

      <CustomButton 
      type = "submit" text = "login"
      bgColor={constants.pColor}
      width = "290px"/>
      { usernameOrPasswordError != '' ? <p style={{alignSelf: "center",
    color: "red"}}> 
      {usernameOrPasswordError}</p> : null}
    </form>
  );
};

export default Login;
