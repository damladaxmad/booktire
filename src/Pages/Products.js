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
import { addProduct, deleteProduct, setProductDataFetched, setProducts, updateProduct } from "../containers/products/productSlice";
import CreateProduct from "../containers/products/CreateProduct";
import ProductStatement from "../containers/products/ProductStatement";
import { Typography } from "@material-ui/core";
import Services from "./Services";

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
  const [showServices, setShowServices] = useState(false)
  const token = useSelector(state => state.login.token)
  const products = JSON.parse(JSON.stringify(useSelector(state => state.products?.products || [])))
  const [showStatement, setShowStatement] = useState(false)
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (tabIndex) => {
    setCurrentTab(tabIndex);
  };

  const dispatch = useDispatch()

  const { showRegister, update, toBeUpdatedCustomer,
    handleUpdate, handleHide, handleShowRegister } = useRegisterForm()

    const { loading, error } = useReadData(
       url,
       setProducts,
       setProductDataFetched,
      state => state.products?.isProductsDataFetched,
       "products"
   );

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

     
      <div style={{
        display: 'flex',
        marginBottom: '20px',
        gap: "10px",
        width: "100%",
        justifyContent: "flex-start"
      }}>
        <div
          onClick={() => handleTabChange(0)}
          style={{
            padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 0 ? constants.pColor : 'transparent',
            color: currentTab === 0 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          <Typography>Products</Typography>
        </div>

        <div
          onClick={() => handleTabChange(1)}
          style={{
            padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 1 ? constants.pColor : 'transparent',
            color: currentTab === 1 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          <Typography>Services</Typography>
        </div>

        </div>

        {currentTab == 1 && <Services />}

        {(!showStatement && currentTab == 0 ) && <TitleComponent title=""
        btnName="Create Products" onClick={handleShowRegister} />}

      {(!showStatement && currentTab == 0 ) && <CustomRibbon query={query}
        setQuery={handleSearchChange} />}


      {(!showStatement && currentTab == 0 ) && <Table
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
        }} 
        onProductStatement = {(data)=> {
          setInstance(data)
          setShowStatement(true)
        }}/>}
      
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

        {showStatement && <ProductStatement product = {instance} goBack = {()=> setShowStatement(false)}/>}

      <ToastContainer />

    </div>
  )
}