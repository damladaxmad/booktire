import { Route } from "react-router-dom";
  import Dashboard from "./Pages/Dashboard";
import Customers from "./Pages/Customers";
import Vendors from "./Pages/Vendors";
import Sales from "./Pages/Sales";
import Reports from "./Pages/Reports"
import Purchases from "./Pages/Purchases"
import Adminstration from "./Pages/Adminstration"
import Products from "./Pages/Products";

export const pages = [
        <Route path="/dashboard" element={<Dashboard />} />,
        <Route path="/customers" element={<Customers />} />,
        <Route path="/vendors" element={<Vendors />} />,
        <Route path="/sales" element={<Sales />} />,
        <Route path="/purchases" element={<Purchases />} />,
        <Route path="/reports" element={<Reports />} />,
        <Route path="/adminstration" element={<Adminstration />} />,
        <Route path="/products" element={<Products />} />,
]