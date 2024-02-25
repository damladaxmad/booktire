import { useDispatch } from 'react-redux';
import { addCustomer, deleteCustomer, updateCustomer } from "../containers/customer/customerSlice";
import { addVendor, deleteVendor, updateVendor } from '../containers/vendor/vendorSlice';
// import { addVendor, deleteVendor, updateVendor } from "../containers/vendor/vendorSlice";

const useEventHandler = () => {
  const dispatch = useDispatch();

  const handleEvent = (data, mySocketId, businessId, eventType) => {
    const { socketId} = data;

    if (mySocketId === socketId || data?.businessId !== businessId) return;

    switch (eventType) {
      case 'customerEvent':
        handleCustomerEvent(data);
        break;
      case 'vendorEvent':
        handleVendorEvent(data);
        break;
      default:
        break;
    }
  };

  const handleCustomerEvent = (data) => {
    const { eventType, customer } = data;

    switch (eventType) {
      case 'add':
        dispatch(addCustomer(customer));
        break;
      case 'delete':
        dispatch(deleteCustomer(customer)); 
        break;
      case 'update':
        dispatch(updateCustomer({
            _id: customer?._id,
            updatedCustomer: customer
          }));
        break;
      default:
        break;
    }
  };

  const handleVendorEvent = (data) => {
    const { eventType, vendor } = data;

    switch (eventType) {
      case 'add':
        dispatch(addVendor(vendor));
        break;
      case 'delete':
        dispatch(deleteVendor(vendor)); 
        break;
      case 'update':
        dispatch(updateVendor({
            _id: vendor?._id,
            updatedVendor: vendor
          }));
        break;
      default:
        break;
    }
  };

  return { handleEvent };
};

export default useEventHandler;
