import { useSelector } from "react-redux";
import { constants } from "../Helpers/constantsFile";
import useReadData from "../hooks/useReadData";

export default function Products() {
  const { business } = useSelector(state => state.login.activeUser)
  const products = JSON.parse(JSON.stringify(useSelector(state => state.products?.products || [])))
  const url = `${constants.baseUrl}/products/get-business-products/65cb22c6d728425e0f1ee777`

  const { loading, error } = useReadData(url, "product");

  console.log(products)

    return (
      <div style={{width: "95%", margin: "auto"}}>
        <h2> Products</h2>
      </div>
    )
  }