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
  const [noInternet, setNoInternet] = useState(false);
  const [disableButton, setDisableButton] = useState(false); // State to disable button

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
    try {
      const response = await axios.post(`${constants.baseUrl}/users/authenticate`, {
        username: values.userName,
        password: values.password,
        version: "notify_version"
      });

      dispatch(setActiveUser(response.data?.data?.user));
      dispatch(setToken(`Bearer ${response?.data?.token}`));
      dispatch(setIsLogin(true));
      setShowSpinner(false);
      props.showHandler(response.data?.data?.user);
    } catch (err) {
      setShowSpinner(false);
      if (!navigator.onLine) {
        setUsernameOrPasswordError(""); // Clear error message if no internet
        setDisableButton(true); // Disable button if no internet
      } else {
        setUsernameOrPasswordError(err.response?.data?.message || "Incorrect username or password"); // Display error message for incorrect credentials
        setDisableButton(false); // Enable button if there's an error
      }
    }
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
    if (stateValues !== "") authenticateFun(stateValues);
  }, [stateValues])

  // Event listener to check for online/offline status
  useEffect(() => {
    const handleConnectionChange = () => {
      setNoInternet(!navigator.onLine);
      if (navigator.onLine) {
        setDisableButton(false); // Enable button when internet connection is restored
      }
    };

    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, []);

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ display: "flex", gap: "16px", flexWrap: "wrap",
      justifyContent: "center"
     }}
    >
      {loginArr.map((a, index) => (
        <div key={index}>
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
        type="submit" 
        text="login"
        bgColor={constants.pColor}
        width="290px"
        disabled={disableButton}
        style = {{marginBottom: "10px"}}
      />
      {noInternet && !disableButton && 
        <p style={{alignSelf: "center", color: "red"}}>
          No internet connection
        </p>
      }
      {!noInternet && usernameOrPasswordError && 
        <p style={{alignSelf: "center", color: "red"}}>
          {usernameOrPasswordError}
        </p>
      }
    </form>
  );
};

export default Login;
