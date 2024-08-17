import AccountList from "../containers/accounts/AccountList";
import LastTransactions from "../containers/accounts/LastTransactoins";
import { constants } from "../Helpers/constantsFile";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Button, Typography } from "@material-ui/core";
import Register from "../utils/Register";
import { fields } from "../containers/accounts/accountModal";
import CustomButton from "../reusables/CustomButton";
import AccountDetails from "../containers/accounts/AccountDetails";
import Transactions from "../containers/transaction/Transactions";
import { addAccount, setAccountDataFetched, setAccounts } from "../containers/accounts/accountSlice";
import useReadData from "../hooks/useReadData";

export default function Accounts() {

    const accounts = useSelector(state => state.accounts.accounts)
    const { business } = useSelector(state => state.login?.activeUser);
    const token = useSelector(state => state.login?.token);
    const [showRegister, setShowRegister] = useState(false)
    const [account, setAccount] = useState()
    const [showAccountDetails, setShowAccountDetails] = useState(false)
    const url = `${constants.baseUrl}/accounts/get-business-accounts/${business?._id}`;

    const dispatch = useDispatch()
    const { loading, error, data } = useReadData(
        url,
        setAccounts,
        setAccountDataFetched,
        state => state.accounts.isAccountDataFetched,
        "accounts"
    );

    const handleAccountClick = (account) => {
        setAccount(account)
        setShowAccountDetails(true)
    }

    console.log(accounts)

    return (
        <div style={{
            display: "flex", flexDirection: "column", width: "95%",
            margin: "auto", gap: "20px", justifyContent: "space-between"
        }}>
            {showAccountDetails && <Transactions
                instance={account}
                client="account"
                endPoint = "account-transactions"
                url={`${constants.baseUrl}/account-transactions/get-account-transactions/${account?._id}`}
                hideTransactions={() => setShowAccountDetails(false)} />}

            {!showAccountDetails && <CustomButton text="add account" style={{ marginRight: "auto", marginBottom: "20px" }}
                onClick={() => setShowRegister(true)} />}

            <div style={{
                display: "flex", flexDirection: "row", width: "100%",
                margin: "auto", gap: "20px", justifyContent: "space-between"
            }}>
                {!showAccountDetails && <AccountList accounts={accounts} onAccountClick={handleAccountClick} />}
                {!showAccountDetails && <div style={{ width: "35%" }}>
                    <Typography style={{
                        fontSize: "16px", fontWeight: "bold",
                        color: "#909090"
                    }}> Latest Transactions</Typography>
                    <LastTransactions />
                </div>}

                {/* {showAccountDetails && <AccountDetails account={account} hideModal={() => {
                    setShowAccountDetails(false)
                }} />} */}

                {showRegister && <Register
                    name="Account"
                    fields={fields}
                    url="accounts"
                    business={business?._id}
                    hideModal={() => { setShowRegister(false) }}
                    store={(data) => {
                        console.log(data)
                        dispatch(addAccount(data?.account))
                    }}
                />}
            </div>
        </div>
    )
}