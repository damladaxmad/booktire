import AccountList from "../containers/accounts/AccountList";
import LastTransactions from "../containers/accounts/LastTransactoins";
import { constants } from "../Helpers/constantsFile";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button, Typography } from "@material-ui/core";
import Register from "../utils/Register";
import { fields } from "../containers/accounts/accountModal";
import CustomButton from "../reusables/CustomButton";

export default function Accounts () {

    const [accounts, setAccounts] = useState([]);
    const { business } = useSelector(state => state.login?.activeUser);
    const token = useSelector(state => state.login?.token);
    const [loading, setLoading] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    const fetchAccounts = () => {
        axios.get(`${constants.baseUrl}/accounts/get-business-accounts/${business?._id}`, {
            headers: {
                "authorization": token
            }
        }).then(res => {
            setAccounts(res?.data?.data?.accounts || []);
        }).catch(error => {
            console.error("Error fetching accounts:", error);
        }).finally(() => {
            setLoading(false); 
        });
    };

    useEffect(() => {
        fetchAccounts();
    }, []);


    return (
        <div style = {{display: "flex", flexDirection: "column", width: "95%",
            margin: "auto", gap: "20px", justifyContent: "space-between"
        }}>
            <CustomButton text = "add account" style = {{marginRight: "auto", marginBottom: "20px"}}
            onClick={()=> setShowRegister(true)}/>

        <div style = {{display: "flex", flexDirection: "row", width: "100%",
            margin: "auto", gap: "20px", justifyContent: "space-between"
        }}>
            <AccountList accounts = {accounts}/>
            <div style={{ width: "35%" }}>
          <Typography style={{
            fontSize: "16px", fontWeight: "bold",
            color: "#909090"
          }}> Latest Transactions</Typography>
            <LastTransactions />
        </div>
        
        {showRegister && <Register
        name="Account"
        fields={fields}
        url="accounts"
        business={business?._id}
        hideModal={() => { setShowRegister(false) }}
        store={(data) => {
        //   dispatch(addUser(data?.user)) 
        //   notify("User created successfully") 
        }}
      />}
        </div>
        </div>
    )
}