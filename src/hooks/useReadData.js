import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCustomerDataFetched, setCustomers } from "../containers/customer/customerSlice";
import { setProducts } from "../containers/products/productSlice";
import { setVendorDataFetched, setVendors } from "../containers/vendor/vendorSlice";
import { setUserDataFetched, setUsers } from "../containers/user/userSlice";


const useReadData = (url, type) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = useSelector(state => state?.login?.token)
    const { isCustomerDataFetched } = useSelector(state => state?.customers)
    const {isProductDataFetched} = useSelector(state => state.products)
    const {isUserDataFetched} = useSelector(state => state.users)
    useEffect(() => {
        if (type == "customer" && isCustomerDataFetched) return
        if (type == "product" && isProductDataFetched) return
        if (type == "user" && isUserDataFetched) return
        let source = axios.CancelToken.source();

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(url, {
                    headers: {
                        'authorization': token
                    },
                    cancelToken: source.token
                });
                setLoading(false);
                console.log(response?.data?.data)
                type == "customer" && dispatch(setCustomers(response?.data?.data?.customers));
                type == "customer" && dispatch(setCustomerDataFetched(true));
                type == "vendor" && dispatch(setVendors(response?.data?.data?.vendors));
                type == "vendor" && dispatch(setVendorDataFetched(true));
                type == "user" && dispatch(setUsers(response?.data?.data?.users));
                type == "user" && dispatch(setUserDataFetched(true));
                type == "product" && dispatch(setProducts(response?.data?.data?.products));
            } catch (error) {
                if (!axios.isCancel(error)) {
                    setError("Error getting the data");
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            source.cancel();
        };
    }, [dispatch, url, token]);

    return { loading, error };
};

export default useReadData;
