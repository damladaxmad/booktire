import React, { useState } from 'react';
import CustomButton from '../../reusables/CustomButton';
import axios from 'axios';
import { constants } from '../../Helpers/constantsFile';
import { useSelector } from 'react-redux';
import { Checkbox } from '@material-ui/core';

export default function ({customers, hide}) {
    const [isChecked, setIsChecked] = useState(true);
    const [disabled, setDisabled] = useState(false)
    const {business} = useSelector(state => state.login.activeUser)
    const token = useSelector(state => state.login.token)

    let updatedCustomers = []
    customers?.map(data => {
        updatedCustomers.push({
            business: business?._id,
            name: data["Name"],
            phone: data["Phone"]?.toString() || "0000000000",
            balance: data["Balance"],
            district: data.District || "empty",
            type: "deynle"
            })
    })

    const loopAndUpload = async (element) => {
        let myElement = { ...element };
        const balance = myElement.balance;
        delete myElement.balance;
    
        const response = await axios.post(
            `${constants.baseUrl}/customers`,
            myElement,
            {
                headers: {
                    "authorization": token
                }
            }
        );
    
        if (isChecked) {
            const response2 = await axios.post(
                `${constants.baseUrl}/transactions`,
                {
                    business: business?._id,
                    customer: response.data?.data?.customer?._id,
                    description: "Total",
                    debit: balance,
                    date: "2024/02/6"
                },
                {
                    headers: {
                        "authorization": token
                    }
                }
            );
        }
    };
    

      const createHandler = async()=> {
        setDisabled(true);
        for (const customer of updatedCustomers) {
        await loopAndUpload(customer);
         }
        setDisabled(false);
        alert("Succesfully Import Data from Excel")
      }


    return (
        <div style={{ width: "95%", background: "white", borderRadius: "10px",
                      margin: "auto", padding: "30px", display: "flex", flexDirection: "column",
                      gap: "35px"}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style = {{display: "flex", flexDirection: "row", gap: "0px",
            alignItems: "center"}}>

                      <Checkbox
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                        style={{
                            color: '#6A03B6', 
                            '&.Mui-checked': {
                                color: '#6A03B6' 
                            },
                        }}
                    />
                    <label>Add balances</label>
                </div>

                <div style = {{display: "flex", flexDirection: "row", gap: "15px"}}>
                    
                    <CustomButton 
                    bgColor='white'
                    text = "cancel"
                    fontSize= "14px"
                    color = "black"
                    width= "120px"
                    height = "35px"
                    onClick={hide}
                    />
                    <CustomButton 
                    disabled={disabled}
                    text = "CREATE"
                    fontSize= "14px"
                    width= "120px"
                    height = "35px"
                    onClick={createHandler}
                    />

                </div>

            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px"}}>
                {customers.map((customer, index) => (
                    <div key={index} style={{ display: "flex", justifyContent: "space-between",
                    border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
                        <span style = {{flex: 0.2}}>{index + 1}.</span>
                        <span style = {{flex: 2}}>{customer.Name}</span>
                        <span style = {{flex: 1}}>{customer.Phone}</span>
                        <span style = {{flex: 1}}>{customer.District}</span>
                        <span style = {{flex: 1}}>{isChecked ? `$${customer.Balance}` : 'Hidden'}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
