import { Typography } from "@material-ui/core";
import * as XLSX from 'xlsx'
import { useState } from "react";
import StoreCustomers from "./StoreCustomers";
import CustomButton from "../../reusables/CustomButton";

export default function ImportCustomers({showCustomers}) {
    const [excelFile, setExcelFile] = useState(null);
    const [excelFileError, setExcelFileError] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [showStoreCustomers, setShowStoreCustomers] = useState(false)
    const fileType = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

    const handleSubmit = (e) => {
        e.preventDefault()

        if (excelFile !== null) {

            try {
                const workbook = XLSX.read(excelFile, { type: 'buffer' });
                const worksheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[worksheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);
                const sheetName = 'Sheet1';
                console.log(data)
                if (workbook.SheetNames.includes(sheetName)) {
                    const worksheet = workbook.Sheets[sheetName];
                    const data = XLSX.utils.sheet_to_json(worksheet);
                    setExcelData(data);
                    showCustomers(true)
                    setShowStoreCustomers(true)
                }
            } catch (error) {
                console.error('Error reading Excel file:', error);
                setExcelData(null);
            }
        }
        else {
            setExcelData(null);
        }
    }

    const handleFile = (e) => {
        let selectedFile = e.target.files[0];

        if (selectedFile) {

            if (selectedFile && fileType.includes(selectedFile.type)) {
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (e) => {
                    console.log(e)
                    setExcelFileError(null);
                    setExcelFile(e.target.result);
                }

            }
            else {
                setExcelFileError('Please select only excel file types');
                setExcelFile(null);
            }
        }
        else {
            console.log('plz select your file');
        }

    }

    console.log(excelData)

    return (
        <>
            {showStoreCustomers && <StoreCustomers customers = {excelData} 
            hide = {()=> {
                setShowStoreCustomers(false)
                showCustomers(false)
            }}/>}

       {!showStoreCustomers && <div style={{
            background: "white", width: "50%", margin: "auto", borderRadius: "10px",
            display: "flex", flexDirection: "column", gap: "20px", alignItems: "center",
            padding: "30px"
        }}>

            <form autoComplete="off"
                onSubmit={handleSubmit}>
                <Typography style={{ fontWeight: "bold", fontSize: "18px" }}> Get Customers From Excel</Typography>
                <br></br>

                <input type='file'
                    onChange={handleFile} required></input>

                {excelFileError && <div className='text-danger'
                    style={{ marginTop: 5 + 'px' }}>{excelFileError}</div>}

               <CustomButton
               type = "submit"
               text = "Submit"
               height= "30px"
               fontSize= "12px"
               />

            </form>

        </div>}
        </>
    )
}