import React, { useState, useEffect } from 'react';
import { Typography, Checkbox } from '@mui/material';
import CustomButton from '../../reusables/CustomButton';
import { constants } from '../../Helpers/constantsFile';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BiArrowBack } from 'react-icons/bi';

export default function Privileges({ user, hide }) {
    const [selectedTabs, setSelectedTabs] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const token = useSelector(state => state.login?.token);

    // List of tab names
    const tabNames = ['Dashboard', 'Customers', 'Vendors', 'Products', 'Sales', 'Purchases', 'Reports', 'Adminstration'];

    // Function to handle tab selection
    const handleTabSelect = (tabName) => {
        if (selectedTabs.includes(tabName)) {
            setSelectedTabs(selectedTabs.filter(tab => tab !== tabName));
        } else {
            setSelectedTabs([...selectedTabs, tabName]);
        }
    };

    // Initialize selected tabs with user's privileges
    useEffect(() => {
        if (user.privileges) {
            setSelectedTabs(user.privileges);
        }
    }, [user.privileges]);

    const createPrivileges = () => {
        console.log(selectedTabs)
        setDisabled(true);
        axios.patch(`${constants.baseUrl}/users/${user._id}`, {
            privileges: selectedTabs
        }, {
            headers: {
                authorization: token
            }
        }).then((res) => {
            alert("Successfully Given Access");
            setDisabled(false);
        }).catch((err)=> {
            alert(err.response?.data?.message);
            setDisabled(false);
        });
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            width: '95%',
            padding: '30px 40px'
        }}>
            <div style = {{display: "flex", justifyContent: "space-between"}}>
            <Typography style={{
                fontWeight: 'bold',
                fontSize: '18px'
            }}>Select Tabs to Access:</Typography>

            <Typography style={{
                fontWeight: 'bold',
                color: constants.pColor,
                cursor: "pointer",
                fontSize: '18px',
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }}
            onClick = {hide}> <BiArrowBack
            style={{
                color: constants.pColor,
            }}
        /> back</Typography>

            

            </div>

            <div style = {{display: "flex", flexDirection: "row", width: "100%",
            flexWrap: "wrap", gap: "20px"}}>
            {tabNames.map((tabName, index) => (
                <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    width: "40%",
                    padding: '5px',
                    gap: "10px",
                    borderRadius: '5px',
                    cursor: "pointer",
                    backgroundColor: selectedTabs.includes(tabName) ? '#FAF3FF' : 'transparent'
                }}
                onClick={()=> handleTabSelect(tabName)}>
                    <Checkbox
                        checked={selectedTabs.includes(tabName)}
                        onChange={() => handleTabSelect(tabName)}
                        style={{
                            color: '#6A03B6', 
                            '&.Mui-checked': {
                                color: '#6A03B6' 
                            },
                        }}
                    />
                    <Typography>{tabName}</Typography>
                </div>
            ))}
            </div>

            <CustomButton 
                disabled={disabled}
                text="Create"
                width = "180px"
                style = {{marginTop: "5px"}}
                bgColor={constants.pColor}
                onClick={createPrivileges}
            />
        </div>
    );
}
