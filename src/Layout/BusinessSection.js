import { Avatar, Typography } from "@material-ui/core";
import logo from "../assets/images/logo.png"
import * as RiIcons from 'react-icons/ri';
import { useSelector } from "react-redux";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import React, { useState } from "react";
import { constants } from "../Helpers/constantsFile";

const subDivStyle = {
    display: "flex", background: constants.businnesColor, borderRadius: "10px",
    flexDirection: "row", padding: "10px", width: "90%", cursor: "pointer",
    gap: "10px", alignItems: "center", margin: "auto",
    marginLeft: "11px", justifyContent:"space-between"
}

export default function BusinessSection() {
    const {business} = useSelector((state) => state.login.activeUser);
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (

        <div style={{
            position: "absolute", left: 0, bottom: 0, width:
                "100%", margin: "0px", display: "flex", marginBottom: "10px" 
        }}>

            <div 
                id="fade-button"
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            style={subDivStyle}>

                <Avatar
                    style={{ backgroundColor: "white", padding: "5px",
                width: "35px", height: "35px" }}
                    sx={{ width: 33, height: 33 }}
                >
                    <img
                        src={logo}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </Avatar>

                <div style={{ display: "flex", flexDirection: "column", }}>
                    <Typography style={{ fontSize: "13px", fontWeight: "bold", color: "white" }}> {business?.businessName}</Typography>
                    <Typography style={{ fontSize: "13px", color: constants.businessSubText }}> {business?.businessNumber || "252 616549198"}</Typography>
                </div>

                <RiIcons.RiArrowDownSFill style={{ fontSize: "20px",  color: "white" }} />,

            </div>

            <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          getContentAnchorEl={null}
          PaperProps={{
            style: {
              width: '220px', // Adjust width as needed
            },
          }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
        </div>
    )
}

// import * as React from 'react';
// import Button from '@mui/material/Button';


// export default function FadeMenu() {


//   return (
//     <div>
//       <Button

//       >
//         Dashboard
//       </Button>

//     </div>
//   );
// }