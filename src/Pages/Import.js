import { useState } from "react";
import ImportCustomers from "../containers/customer/ImportCustomers";
import ImportProducts from "../containers/products/ImportProducts";


export default function Import() {
    const [showingProducts, setShowingProducts] = useState(false)
    const [showingCustomers, setShowingCustomers] = useState(false)

   return (
    <div style = {{display: "flex", flexDirection: "column", gap: "35px"}}>

       {!showingProducts && <ImportCustomers showCustomers = {(data) => setShowingCustomers(data)}/>}
       {!showingCustomers && <ImportProducts showProducts = {(data) => setShowingProducts(data)}/>}

    </div>
   )
}