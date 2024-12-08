import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import Modal from "../Modal/Modal";
import { constants } from "../Helpers/constantsFile";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../reusables/CustomButton";
import useReadData from "../hooks/useReadData";
import Select from "react-select"
import { addExpenseType, setExpenseTypes, setExpenseTypesDataFetched } from "../containers/expenseTypes/expenseTypesSlice";
import moment from "moment";
import { expenseTypeFields } from "../containers/expenseTypes/expenseTypeModal";

const Register = ({instance, store, name, fields, update, url, business,
hideModal, onUpdate}) => {

  const filteredFields = fields.filter(field => !(update && name === "User" && field.name === "password"));
  const [disabled, setDisabled] = useState(false)
  const token = useSelector(state => state.login.token)
  const [showExpenseType, setShowExpenseType] = useState(false)
  const mySocketId = useSelector(state => state?.login?.mySocketId)
  const { business: business2 } = useSelector(state => state.login.activeUser)
  const expenseTypes = JSON.parse(JSON.stringify(useSelector(state => state.expenseTypes?.expenseTypes || [])))
  const expenseTypeUrl = `${constants.baseUrl}/expenses-types/get-business-expense-types/${business2?._id}`

  useReadData(
    expenseTypeUrl,
    setExpenseTypes,
    setExpenseTypesDataFetched,
    state => state.users.isExpenseTypesDataFetched,
    "expenseTypes"
  );

  const today = new Date()

  const validate = (values) => {
    const errors = {};

     if ( (name !== "Category" &&  name !== "Account" && !values.name && name !== "Qarashaad")) {
       errors.name = "Field is Required";
     }

     if ( name == "Category" && name !== "Type" && !values.categoryName) {
       errors.categoryName = "Field is Required";
     }
     if ( (name !== "User" && name !== "Category" && name !== "Employee" && name !== "Account" && name !== "Type" && name !== "Service Category" && name !== "Service Type" && name !== "Qarashaad") && (!values.phone)) {
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
        role: update && name == "User" ? instance?.role : "",
        description: update && name == "Qarashaad" ? instance?.description : "",
        amount: update && name == "Qarashaad" ? instance?.amount : "",
        date: update && name == "Qarashaad" ? moment(instance?.date).format("YYYY-MM-DD") : moment(today).format("YYYY-MM-DD"),
        expenseType: update ? instance?.expenseType : "",
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
          alert(err?.response?.data?.message);
        });
      }    
    
    },
  });

  const dispatch = useDispatch()

 
  return (
    <Modal onClose = {hideModal} pwidth = {"450px"}
    left = {name == "Expense" ? "32%" : "38%"} top = "22%">
      {showExpenseType && <Register
        update={false}
        name="Type"
        fields={expenseTypeFields}
        url="expenses-types"
        business={business}
        hideModal={() => { setShowExpenseType(false) }}
        store={(data) => {
          console.log(data)
          // notify("Expense Added Successfully!")
          dispatch(addExpenseType(data?.createdExpenseType))
        }}
      />}
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

{(name ==  "Qarashaad" ) && 
          <div style={{ display: "flex", gap: "15px", width: "290px",  }}>
          <Select
            placeholder='Select type'
            styles={{
              control: (styles, { isDisabled }) => ({
                ...styles,
                border: "1px solid lightGrey",
                height: "40px",
                borderRadius: "5px",
                width: "215px",
                minHeight: "28px",
                ...(isDisabled && { cursor: "not-allowed" }),
              }),
              menu: (provided, state) => ({
                ...provided,
                zIndex: 9999 
              }),
              option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? "black" : "inherit", // Keep text black for selected option
                backgroundColor: state.isSelected ? constants.pColor + "1A" : "inherit",
                "&:hover": {
                  backgroundColor: constants.pColor + "33",
                }
              }),
              singleValue: (provided, state) => ({
                ...provided,
                color: "black",
              }),
              input: (provided, state) => ({
                ...provided,
                color: "black", 
                "&:focus": {
                  borderColor: constants.pColor,
                  boxShadow: `0 0 0 1px ${constants.pColor}`,
                }
              }),
            }}
            menuPlacement="top" 
            value={formik.values.expenseType ? { value: formik.values.expenseType, label: formik.values.expenseType?.name } : null}
            options={expenseTypes?.map(type => ({ value: type, label: type?.name }))}
            onChange={(selectedOption) => formik.setFieldValue("expenseType", selectedOption ? selectedOption.value : null)}
            isClearable={true} 
            isDisabled={disabled}
          />
          <CustomButton text="ADD" style={{ fontSize: "14px" }} width="55px" bgColor="black"
              onClick={() => setShowExpenseType(true)} />
              </div>
          }

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
