import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import Modal from "../../Modal/Modal";
import { constants } from "../../Helpers/constantsFile";
import { useSelector } from "react-redux";
import CustomButton from "../../reusables/CustomButton";
import Select from "react-select";
import { setCategories, setCategoryDataFetched } from "../category/categorySlice";
import useReadData from "../../hooks/useReadData";

// const categories = [
//   "Apple Phone",
//   "Android Phones",
//   // Add more categories as needed
// ];

const CreateProduct = ({ instance, store, name, fields, update, url, business, hideModal, onUpdate }) => {
  const [disabled, setDisabled] = useState(false);
  const token = useSelector(state => state.login.token);
  const mySocketId = useSelector(state => state?.login?.mySocketId);
  const { business: business2 } = useSelector(state => state.login.activeUser)
  const url2 = `${constants.baseUrl}/product-categories/get-business-product-categories/${business2?._id}`
  const categories = JSON.parse(JSON.stringify(useSelector(state => state.categories?.categories || [])))

  console.log(categories)
  useReadData(
    url2,
    setCategories,
    setCategoryDataFetched,
    state => state.users.isCategoriesDataFetched,
    "categories"
  );

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
    initialValues: {
      name: update ? instance?.name : "",
      quantity: update ? instance?.quantity : "",
      unitPrice: update ? instance?.unitPrice : "",
      salePrice: update ? instance?.salePrice : "",
      unitMeasurment: update ? instance?.unitMeasurment : "",
      reOrderNumber: update ? instance?.reOrderNumber : "",
      category: update ? instance?.category : null,
    },
    validate,
    onSubmit: (values) => {
      setDisabled(true);
      values.business = business;
      values.socketId = mySocketId;

      // Convert category to string if it's an object
      if (typeof values.category === 'object') {
        values.category = values.category.categoryName;
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

  return (
    <Modal onClose={hideModal} pwidth="600px" left="32.5%" top="24%">
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
          style={{
            display: "flex", gap: "20px",
            flexDirection: "row", alignItems: "center", justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {fields?.map((a, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontWeight: "bold", fontSize: "12px" }}>{a.title}:</label>
              <input
                placeholder={a.label}
                id={a.name}
                name={a.name}
                type={a.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[a.name]}
                style={{
                  width: "250px", color: "black",
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

          {/* React-Select for category */}
          <Select
            placeholder='Select category'
            styles={{
              control: (styles, { isDisabled }) => ({
                ...styles,
                border: "1px solid lightGrey",
                height: "40px",
                borderRadius: "5px",
                width: "250px",
                minHeight: "28px",
                ...(isDisabled && { cursor: "not-allowed" }),
              }),
              menu: (provided, state) => ({
                ...provided,
                zIndex: 9999 // Ensure the dropdown is on top of other elements
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
                color: "black", // Keep text black for selected value
              }),
              input: (provided, state) => ({
                ...provided,
                color: "black", // Keep text black for input
                "&:focus": {
                  borderColor: constants.pColor,
                  boxShadow: `0 0 0 1px ${constants.pColor}`,
                }
              }),
            }}
            menuPlacement="top" // Position the menu above the select input
            value={formik.values.category ? { value: formik.values.category, label: formik.values.category.categoryName } : null}
            options={categories.map(category => ({ value: category, label: category.categoryName }))}
            onChange={(selectedOption) => formik.setFieldValue("category", selectedOption ? selectedOption.value : null)}
            isClearable={true} // Make the Select clearable
            isDisabled={disabled}
          />

          <CustomButton
            disabled={disabled}
            type="submit"
            width="250px"
            text={update ? `Update ${name}` : `Create ${name}`}
            bgColor={constants.pColor}
            style={{ marginTop: "0px" }}
          />
        </form>
      </div>
    </Modal>
  );
};

export default CreateProduct;
