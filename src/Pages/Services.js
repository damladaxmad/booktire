import { useEffect, useState } from "react";
import Table from "../utils/Table";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, deleteCustomer, updateCustomer } from "../containers/customer/customerSlice";
import { constants } from "../Helpers/constantsFile";
import Register from "../utils/Register";
import { deleteFunction } from "../funcrions/deleteStuff";
import useRegisterForm from "../hooks/useRegister";
import CustomRibbon from "../reusables/CustomRibbon";
import { fields } from "../containers/services/serviceModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TitleComponent from "../reusables/TitleComponent.";
import io from 'socket.io-client';
import useReadData from "../hooks/useReadData";
import { addService, deleteService, setServiceDataFetched, setServices, updateService } from "../containers/services/serviceSlice";
import CreateService from "../containers/services/CreateService";
import { setServiceTypeDataFetched, setServiceTypes } from "../containers/serviceType/serviceTypeSlice";

const parentDivStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  margin: "auto"
}

export default function Services() {
  const [query, setQuery] = useState("")
  const [instance, setInstance] = useState(null)
  const { business } = useSelector(state => state.login.activeUser)
  const url = `${constants.baseUrl}/service-types/get-business-service-types/${business?._id}`
  const token = useSelector(state => state.login.token)
  const serviceTypes = JSON.parse(JSON.stringify(useSelector(state => state.serviceTypes?.serviceTypes || [])))
  
  const dispatch = useDispatch()

  const { showRegister, update, toBeUpdatedCustomer,
    handleUpdate, handleHide, handleShowRegister } = useRegisterForm()

  const { loading, error } = useReadData(
    url,
    setServiceTypes,
    setServiceTypeDataFetched,
    state => state.serviceTypes?.isServiceTypesDataFetched,
    "serviceTypes"
  );

  const notify = (message) => toast(message, {
    autoClose: 2700,
    hideProgressBar: true,
    theme: "light",
    position: "top-center"
  });

  const columns = [
    { title: "name", field: "name", width: "24%" },
    { title: "Price", field: "price" },
    // { title: "Type", field: "serviceType", render: data => <p> {data?.serviceType?.name}</p> },
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

      {<TitleComponent title=""
        btnName="Create Service" onClick={handleShowRegister} />}

      {<CustomRibbon query={query}
        setQuery={handleSearchChange} />}

      { <Table
        data={handler(serviceTypes)} columns={columns}
        name="Service"
        state={loading ? "loading.." : error ? error : "no data to display"}
        onUpdate={(data) => {
          handleUpdate(data)
        }}

        onDelete={(data) => {
          deleteFunction(true, "Delete Service",
            data.name,
            `${constants.baseUrl}/services/${data?._id}`,
            token,
            () => { dispatch(deleteService(data)) })
        }} 
       />}
      
      {showRegister && <CreateService
        instance={toBeUpdatedCustomer}
        update={update}
        name="Service"
        fields={fields}
        url="services"
        business={business?._id}
        hideModal={() => { handleHide() }}
        store={(data) => {
          console.log(data)
          dispatch(addService(data?.createdService))
          notify("Service created successfully")
        }}
        onUpdate={
          (data) => {
            dispatch(updateService({
              _id: data?.service?._id,
              updatedService: data?.service
            }));
            notify("Service updated successfully")
          }
        } />}

      <ToastContainer />

    </div>
  )
}
