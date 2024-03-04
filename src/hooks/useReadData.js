import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const useReadData = (url, fetchDataAction, setDataFetchedAction, isDataFetchedSelector, dataKey) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = useSelector(state => state?.login?.token);
    const isDataFetched = useSelector(isDataFetchedSelector);

    useEffect(() => {
        if (isDataFetched) return;

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
                const data = response?.data?.data[dataKey];
                dispatch(fetchDataAction(data));
                dispatch(setDataFetchedAction(true));
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
    }, [dispatch, url, token, fetchDataAction, setDataFetchedAction, isDataFetched, dataKey]);

    return { loading, error };
};

export default useReadData;
