import { Typography } from "@material-ui/core"
import { useSelector } from "react-redux";
import LoadingPlaceHolder from "./LoadingPlaceHolder";
import { useState } from "react";
import { useEffect } from "react";

const Top5DeenCustomers = (props) => {

  const customers = JSON.parse(JSON.stringify(useSelector(state => state.customers?.customers || [])))
  const isDataFetched = useSelector((state) => state.customers.isDataFetched);
  const [loaded, setLoaded] = useState(true)


  let skeArray = [1, 2, 3, 4, 5]
  let values = []
  customers?.map(customer => {
    values.push(customer.balance)
  })
  let topValues = customers?.sort((a, b) => b.balance - a.balance).slice(0, 5)
  console.log(topValues)


  return (
    <div style={{
      background: "white", padding: "21.5px",
      borderRadius: "12px", display: "flex", flexDirection: "column",
      gap: "10px", minWidth: "34.5%", marginRight: "18px",
    }}>
      {!loaded && (
        <LoadingPlaceHolder
          extraStyles={{
            height: "15px",
            width: "120px",
            marginBottom: "16px",
            borderRadius: "10px",
          }}
        />
      )}
      {/* {loaded && <Typography style = {{color: "lightGray", fontWeight: "bold"}}>
                Customers Deen
            </Typography>}
            {!loaded && (
          <LoadingPlaceHolder
            extraStyles={{
              height: "15px",
              width: "160px",
              marginBottom: "16px",
              borderRadius: "10px",
            }}
          />
        )}
           {loaded && <Typography style = {{fontWeight: "600", fontSize: "22px",
        color: "black"}}>
            Top Deen Customers
            </Typography>} */}

      {loaded ? topValues?.map((customer, index) => {
        if (customer?.balance < 1) return
        if (!loaded) return <LoadingPlaceHolder
          extraStyles={{
            height: "15px",
            marginBottom: "16px",
            borderRadius: "10px",
          }}
        />
        return <div style={{ display: "flex", borderBottom: "1px solid #E3E3E3", paddingBottom: "4px",}}>
            <Typography style={{
              fontSize: "14px",
              color: "gray",
              flex: "0.2"
            }}> {index + 1}. </Typography>

            <Typography style={{
              fontSize: "14px",
              color: "black",
              flex: "1.5"
            }}> {customer.name.substring(0, 20)}
              {customer.name.length <= 20 ? null : "..."} </Typography>

            <Typography style={{
              fontSize: "14px",
              color: "black",
              flex: "1"
            }}> {customer.phone.substring(0, 20)}
              {customer.name.length <= 20 ? null : "..."} </Typography>

          <Typography style={{
            fontSize: "14px",
            color: "black",
            flex: "0.4",
            marginLeft: "auto"
          }}> ${customer.balance?.toFixed(2)} </Typography>
        </div>
      }) : skeArray?.map(index => {
        if (!loaded) return <LoadingPlaceHolder
          extraStyles={{
            height: "15px",
            marginBottom: "16px",
            borderRadius: "10px",
          }}
        />
      })}


    </div>
  )
}

export default Top5DeenCustomers