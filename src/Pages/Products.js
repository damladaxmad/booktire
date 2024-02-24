import { useEffect, useState } from "react";
import Table from "../utils/Table";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, deleteCustomer, updateCustomer } from "../containers/customer/customerSlice";
import { constants } from "../Helpers/constantsFile";
import Register from "../utils/Register";
import { deleteFunction } from "../funcrions/deleteStuff";
import useRegisterForm from "../hooks/useRegister";
import CustomRibbon from "../reusables/CustomRibbon";
import { fields } from "../containers/products/productModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TitleComponent from "../reusables/TitleComponent.";
import io from 'socket.io-client';
import useReadData from "../hooks/useReadData";
import { addProduct, deleteProduct, updateProduct } from "../containers/products/productSlice";
import CreateProduct from "../containers/products/CreateProduct";

const parentDivStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  alignItems: "center",
  width: "95%",
  margin: "auto"
}

export default function Products() {
  const [query, setQuery] = useState("")
  const [instance, setInstance] = useState(null)
  const { business } = useSelector(state => state.login.activeUser)
  const url = `${constants.baseUrl}/products/get-business-products/${business?._id}`
  const mySocketId = useSelector(state => state?.login?.mySocketId)
  const token = useSelector(state => state.login.token)
  const products = JSON.parse(JSON.stringify(useSelector(state => state.products?.products || [])))
  const transactions = JSON.parse(JSON.stringify(useSelector(state => state.transactions.transactions)))

  const dispatch = useDispatch()
  console.log(products)
  const { showRegister, update, toBeUpdatedCustomer,
    handleUpdate, handleHide, handleShowRegister } = useRegisterForm()

  const { loading, error } = useReadData(url, "product");

  const notify = (message) => toast(message, {
    autoClose: 2700,
    hideProgressBar: true,
    theme: "light",
    position: "top-center"
  });

  const columns = [
    { title: "Full Name", field: "name", width: "24%" },
    { title: "Category", field: "category" },
    { title: "Quantity", field: "quantity" },
    { title: "Unit Price", field: "unitPrice" },
    { title: "Sale Price", field: "salePrice" },
  ];

  const handler = (data) => {
    if (data?.length > 0) {
      if (query == "") {
        return data
          .filter((std) => {
            if (std?.status == "deleted") return
              return std;
          })
      } else {
        return data?.filter(
          (std) => {
            if (std?.status == "closed") return
              return (std?.name?.toLowerCase().includes(query))
          }
        );
      }
    } else {
      return;
    }
  };

  const handleSearchChange = (value) => {
    setQuery(value);
  };

  return (
    <div style={parentDivStyle}>

      {<TitleComponent title="Products"
        btnName="Create Products" onClick={handleShowRegister} />}

      {<CustomRibbon query={query}
        setQuery={handleSearchChange} />}

      { <Table
        data={handler(products)} columns={columns}
        name="Product"
        state={loading ? "loading.." : error ? error : "no data to display"}
        onUpdate={(data) => {
          handleUpdate(data)
        }}

        onDelete={(data) => {
          deleteFunction(true, "Delete Product",
            data.name,
            `${constants.baseUrl}/products/${data?._id}`,
            token,
            () => { dispatch(deleteProduct(data)) })
        }} />}

      {showRegister && <CreateProduct
        instance={toBeUpdatedCustomer}
        update={update}
        name="Product"
        fields={fields}
        url="products"
        business={business?._id}
        hideModal={() => { handleHide() }}
        store={(data) => {
          console.log(data)
          dispatch(addProduct(data?.createdProduct))
          notify("Product created successfully")
        }}
        onUpdate={
          (data) => {
            dispatch(updateProduct({
              _id: data?.product?._id,
              updatedProduct: data?.product
            }));
            notify("Product updated successfully")
          }
        } />}

      <ToastContainer />

    </div>
  )
}