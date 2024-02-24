import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import Modal from "../../Modal/Modal";
import { constants } from "../../Helpers/constantsFile";
import { useSelector } from "react-redux";
import CustomButton from "../../reusables/CustomButton";

const CreateProduct = ({instance, store, name, fields, update, url, business,
hideModal, onUpdate}) => {

  const [disabled, setDisabled] = useState(false)
  const token = useSelector(state => state.login.token)
  const mySocketId = useSelector(state => state?.login?.mySocketId)
  const validate = (values) => {
    const errors = {};

     if (!values.name) {
       errors.name = "Field is Required";
     }
     if (!values.unitPrice) {
       errors.unitPrice = "Field is Required";
     }
  

    return errors;
  };

  const formik = useFormik({
    initialValues:{
        name: update ? instance?.name : "",
        quantity: update ? instance?.quantity : "",
        unitPrice: update ? instance?.unitPrice : "",
        salePrice: update ? instance?.salePrice : "",
        unitMeasurment: update ? instance?.unitMeasurment : "",
        reOrderNumber: update ? instance?.reOrderNumber : "",
    },
    validate,
    onSubmit: (values,  ) => {
      setDisabled(true)
      values.business = business
      values.socketId = mySocketId
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
    <Modal onClose = {hideModal} pwidth = {"600px"}
    left = { "32.5%"} top = "24%">
       <div
        style={{
          display: "flex",
          width: "600px",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          height: "390px",
          overflowY: "scroll"
        }}
      >
        <h2>{update ? `${name} Update` : `${name} Creation`}</h2>
     

        <form
        onSubmit={formik.handleSubmit}
        style={{ display: "flex", gap: "20px",
      flexDirection: "row", alignItems: "center", justifyContent: "center",
    flexWrap: "wrap",}}
      >
        
        {fields?.map((a, index) => (
          <div key = {index} style={{display: "flex", flexDirection: "column",
          gap: "5px"}}>
            <label style={{fontWeight: "bold", fontSize: "12px"}}>{a.title}:</label>
            <input
            //   label={a.label}
              placeholder={a.label}
              id={a.name}
              name={a.name}
              type={a.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[a.name]}
              style={{ width: "250px", color: "black",
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
       width = "250px"
       bgColor={constants.pColor}
       text = {update ? `Update ${name}` : `Create ${name}`}
       style = {{marginTop: "10px"}}
       />
      </form>

      </div>
    </Modal>
  );
};

export default CreateProduct;
