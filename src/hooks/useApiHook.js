import { useState, useEffect } from "react";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { useSelector } from "react-redux";

const useApiHook = (url, store) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const token = useSelector(state => state.login.token)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url, {
            headers: {
              'authorization': token
             },
          });
        setData(response.data?.data);
        setLoading(false);
        store(response?.data?.data)
      } catch (error) {
        setError("Error getting the data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useApiHook;