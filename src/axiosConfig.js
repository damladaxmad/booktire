import axios from "axios"
const customAxiosInstance = axios.create({
    baseURL: 'http://localhost:80',
  
    headers: {"Access-Control-Allow-Origin": "*"}
  });

  export default customAxiosInstance