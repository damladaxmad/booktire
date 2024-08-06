import { useState } from "react";
import { constants } from "../Helpers/constantsFile";
import { Typography } from "@material-ui/core";
import PersonalReport from "../containers/reports/PersonalReports";
import StockSummary from "../containers/reports/StockSummary";
import SalesReport from "../containers/reports/SalesReport"; // Import SalesReport component
import PurchaesReport from "../containers/reports/PurchasesReport";
import ExpensesReport from "../containers/reports/ExpenseReport";
import ServicesReport from "../containers/reports/ServicesReport";
import SalesSummary from "../containers/reports/SalesSummary";
import IncomeStatement from "../containers/reports/IncomeStatement";

export default function Reports() {
  const [currentTab, setCurrentTab] = useState(2);

  const handleTabChange = (tabIndex) => {
    setCurrentTab(tabIndex);
  };

  return (
    <div style={{ width: "95%", margin: "auto", display: "flex", flexDirection: "column",
      gap: "5px"
     }}>
      {/* <h2> Reports</h2> */}

      <div style={{
        display: 'flex',
        marginBottom: '20px',
        gap: "10px",
      }}>

            <div
          onClick={() => handleTabChange(2)}
          style={{
            padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 2 ? constants.pColor : 'transparent',
            color: currentTab === 2 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          Products
        </div>

        <div
          onClick={() => handleTabChange(3)}
          style={{
            padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: 'pointer',
            backgroundColor: currentTab === 3 ? constants.pColor : 'transparent',
            color: currentTab === 3 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          Sales
        </div>

        <div
          onClick={() => handleTabChange(6)}
          style={{
            padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: 'pointer',
            backgroundColor: currentTab === 6 ? constants.pColor : 'transparent',
            color: currentTab === 6 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          Services
        </div>

        
        <div
          onClick={() => handleTabChange(4)}
          style={{
            padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: 'pointer',
            backgroundColor: currentTab === 4 ? constants.pColor : 'transparent',
            color: currentTab === 4 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          Purchases
        </div>
        <div
          onClick={() => handleTabChange(5)}
          style={{
            padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: 'pointer',
            backgroundColor: currentTab === 5 ? constants.pColor : 'transparent',
            color: currentTab === 5 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          Expenses
        </div>

        <div
          onClick={() => handleTabChange(7)}
          style={{
            padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: 'pointer',
            backgroundColor: currentTab === 7 ? constants.pColor : 'transparent',
            color: currentTab === 7 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          Summary
        </div>

        <div
          onClick={() => handleTabChange(0)}
          style={{
            padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 0 ? constants.pColor : 'transparent',
            color: currentTab === 0 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          <Typography>Customers</Typography>
        </div>

        <div
          onClick={() => handleTabChange(1)}
          style={{
            padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 1 ? constants.pColor : 'transparent',
            color: currentTab === 1 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          Vendors
        </div>

        <div
          onClick={() => handleTabChange(8)}
          style={{
            padding: '5px 0px',
            width: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: currentTab === 8 ? constants.pColor : 'transparent',
            color: currentTab === 8 ? 'white' : 'black',
            borderRadius: '50px',
            border: `1px solid ${constants.pColor}`
          }}>
          Income
        </div>
  
  
      </div>

      {currentTab == 0 && <PersonalReport name="customers" type="Customers" />}
      {currentTab == 1 && <PersonalReport name="vendors" type="Vendors" />}
      {currentTab == 2 && <StockSummary />}
      {currentTab == 3 && <SalesReport />} 
      {currentTab == 4 && <PurchaesReport />} 
      {currentTab == 5 && <ExpensesReport />} 
      {currentTab == 6 && <ServicesReport />} 
      {currentTab == 7 && <SalesSummary />} 
      {currentTab == 8 && <IncomeStatement />} 
    </div>
  );
}
