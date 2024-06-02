import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import Modal from "../../Modal/Modal";
import { constants } from "../../Helpers/constantsFile";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../reusables/CustomButton";
import Select from "react-select";
import useReadData from "../../hooks/useReadData";
import Register from "../../utils/Register";
import { ToastContainer, toast } from "react-toastify";
import { addServiceType, setServiceTypeDataFetched, setServiceTypes } from "../serviceType/serviceTypeSlice";
import { serviceTypeFields } from "../serviceType/serviceTypeModal";

const CreateProduct = ({ instance, store, name, fields, update, url, business, hideModal, onUpdate }) => {
  const [disabled, setDisabled] = useState(false);
  const [showServiceType, setShowServiceType] = useState(false)
  const token = useSelector(state => state.login.token);
  const mySocketId = useSelector(state => state?.login?.mySocketId);
  const { business: business2 } = useSelector(state => state.login.activeUser)
  const serviceTypes = JSON.parse(JSON.stringify(useSelector(state => state.serviceTypes?.serviceTypes || [])))
  const url2 = `${constants.baseUrl}/service-types/get-business-service-types/${business2?._id}`

  useReadData(
    url2,
    setServiceTypes,
    setServiceTypeDataFetched,
    state => state.users.isServiceTypeDataFetched,
    "serviceTypes"
  );

  const dispatch = useDispatch()

  const validate = (values) => {
    const errors = {};

    if (!values.description) {
      errors.description = "Field is Required";
    }
    if (!values.amount) {
      errors.amount = "Field is Required";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      description: update ? instance?.description : "",
      amount: update ? instance?.amount : "",
      serviceType: update ? instance?.serviceType : null,
    },
    validate,
    onSubmit: (values) => {
      setDisabled(true);
      values.business = business;
      values.socketId = mySocketId;

      // Convert category to string if it's an object
      if (typeof values.serviceType === 'object') {
        values.serviceType = values.serviceType?._id;
      }

      if (update) {
        axios.patch(`${constants.baseUrl}/${url}/${instance._id}`, values, {
          headers: {
            "authorization": token
          }
        }).then((res) => {
          setDisabled(false);
          hideModal();
          onUpdate(res?.data?.data);
        }).catch((err) => {
          setDisabled(false);
          alert(err.response?.data?.message);
        });
      } else {
        axios.post(`${constants.baseUrl}/${url}`, values, {
          headers: {
            "authorization": token
          }
        }).then((res) => {
          setDisabled(false);
          hideModal();
          store(res?.data?.data);
        }).catch((err) => {
          setDisabled(false);
          alert(err.response.data.message);
        });
      }
    },
  });

  const notify = (message) => toast(message, {
    autoClose: 2700,
    hideProgressBar: true,
    theme: "light",
    position: "top-center"
  });


  return (
    <Modal onClose={hideModal} pwidth="600px" left="32.5%" top="24%">
      {showServiceType && <Register
        update={false}
        name="Service Type"
        fields={serviceTypeFields}
        url="service-types"
        business={business}
        hideModal={() => { setShowServiceType(false) }}
        store={(data) => {
          console.log(data)
          notify("ServiceType Added Successfully!")
          dispatch(addServiceType(data?.serviceType))
        }}
      />}
      <div
        style={{
          display: "flex",
          width: "400px",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <h2>{update ? `${name} Update` : `${name} Creation`}</h2>

        <form
          onSubmit={formik.handleSubmit}
          style={{
            display: "flex", gap: "20px",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {fields?.map((a, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
             <input
                placeholder={a.label}
                id={a.name}
                name={a.name}
                type={a.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[a.name]}
                style={{
                  width: "300px", color: "black",
                  padding: "10px", borderRadius: "5px", height: "40px",
                  border: "1px solid lightGrey",
                }}
                key={index}
              />
              {formik.touched[a.name] && formik.errors[a.name] ? (
                <div style={{ color: "red" }}>{formik.errors[a.name]}</div>
              ) : null}
            </div>
          ))}

          <div style={{ display: "flex", gap: "5px", width: "300px", 
            justifyContent: "flex-start"
           }}>
            <Select
              placeholder='Select type'
              styles={{
                control: (styles, { isDisabled }) => ({
                  ...styles,
                  border: "1px solid lightGrey",
                  height: "40px",
                  borderRadius: "5px",
                  width: "230px",
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
              value={formik.values.serviceType ? { value: formik.values.serviceType, label: formik.values.serviceType.name } : null}
              options={serviceTypes?.map(serviceType => ({ value: serviceType, label: serviceType?.name }))}
              onChange={(selectedOption) => formik.setFieldValue("serviceType", selectedOption ? selectedOption.value : null)}
              isClearable={true}
              isDisabled={disabled}
            />

            <CustomButton text="ADD" style={{ fontSize: "14px" }} width="45px" bgColor="black"
              onClick={() => setShowServiceType(true)} />

          </div>

          <CustomButton
            disabled={disabled}
            type="submit"
            width="300px"
            text={update ? `Update ${name}` : `Create ${name}`}
            bgColor={constants.pColor}
            style={{ marginTop: "0px" }}
          />
          <ToastContainer />
        </form>
      </div>
    </Modal>
  );
};

export default CreateProduct;
