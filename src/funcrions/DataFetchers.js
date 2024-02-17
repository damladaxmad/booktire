import { useState, useEffect } from "react";
import { constants } from "../Helpers/constantsFile";
import axios from "axios";
import { useSelector } from "react-redux";

const useFetch = (url, change = "hi", name) => {
  const token = useSelector(state => state.login.token)
      const [data, setData] = useState(null);
      useEffect(() => {
        const fetchData = async() => {
            const response = await axios
            .get(`${constants.baseUrl}/${url}`, {
              headers: {
                'authorization': token
               },
            }).then((res)=>{
                setData(res.data.data[name])
            })
            .catch((err) => {
              alert(err.response?.data?.message);
            });
        }
       fetchData()
      }, [url, change]);
      return data;
};
export default useFetch;