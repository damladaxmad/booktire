import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCustomerDataFetched, setCustomers } from "../containers/customer/customerSlice";


const useReadData = (url, type) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = useSelector(state => state?.login?.token)
    const { isCustomerDataFetched } = useSelector(state => state?.customers)
    useEffect(() => {
        if (type == "customer" && isCustomerDataFetched) return
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
                type == "customer" && dispatch(setCustomers(response?.data?.data?.customers));
                type == "customer" && dispatch(setCustomerDataFetched(true));
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
