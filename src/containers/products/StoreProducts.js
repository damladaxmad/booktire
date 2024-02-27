import React, { useState } from 'react';
import CustomButton from '../../reusables/CustomButton';
import axios from 'axios';
import { constants } from '../../Helpers/constantsFile';
import { useSelector } from 'react-redux';
import { Checkbox } from '@material-ui/core';
import { Typography } from '@mui/material';

export default function ({products, hide}) {
    const [disabled, setDisabled] = useState(false)
    const {business} = useSelector(state => state.login.activeUser)
    const token = useSelector(state => state.login.token)

    const headers = ["No.", "Product Name", "Category", "Quantity", "Unit Price", "Sale Price", "Re-order"]

    let updatedProducts = []
    products?.map(data => {
        updatedProducts.push({
            business: business?._id,
            name: data["Name"],
            category: data["Category"],
            unitPrice: data["UnitPrice"],
            salePrice: data["SalePrice"],
            quantity: data["Quantity"],
            reOrderNumber: data["ReOrderNumber"],
            
            })
    })

    const loopAndUpload = async (element) => {
    
        const response = await axios.post(
            `${constants.baseUrl}/products`,
            element,
            {
                headers: {
                    "authorization": token
                }
            }
        );
    };
    

      const createHandler = async()=> {
        setDisabled(true);
        for (const product of updatedProducts) {
        await loopAndUpload(product);
         }
        setDisabled(false);
        alert("Succesfully Import Data from Excel")
      }


    return (
        <div style={{ width: "95%", background: "white", borderRadius: "10px",
                      margin: "auto", padding: "30px", display: "flex", flexDirection: "column",
                      gap: "35px"}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>

                <div style = {{display: "flex", flexDirection: "row", gap: "15px",
                marginLeft: "auto"}}>
                    
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

            <div style={{ display: "flex", width: "100%", }}>
            {headers.map((header, index) => (
              <Typography key={index} style={{ flex: index === 0 ? "0.4" : 
              index == 1 ? "1.8" : "1", color: "#999999" }}>{header}</Typography>
            ))}
          </div>
                {products.map((product, index) => (
                    <div key={index} style={{ display: "flex", justifyContent: "space-between",
                    border: "1px solid #ccc", padding: "10px", borderRadius: "5px", width: "100%" }}>
                        <span style = {{flex: 0.4}}>{index + 1}.</span>
                        <span style = {{flex: 2, margin: "0px"}}>{product.Name}</span>
                        <span style = {{flex: 1}}>{product.Category}</span>
                        <span style = {{flex: 1}}>{product.Quantity}</span>
                        <span style = {{flex: 1}}>{product.UnitPrice}</span>
                        <span style = {{flex: 1}}>{product.SalePrice}</span>
                        <span style = {{flex: 1}}>{product.ReOrderNumber}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
