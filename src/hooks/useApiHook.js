import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const useApiHook = (url, store) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const token = useSelector(state => state.login.token);

  useEffect(() => {
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
        setData(response.data?.data);
        setLoading(false);
        store(response?.data?.data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError("Error getting the data");
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      // Cancel the request when the component unmounts
      source.cancel();
    };
  }, [url, token, store]);

  return { data, loading, error };
};

export default useApiHook;
