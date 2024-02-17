import { Avatar, Typography } from "@material-ui/core";
import logo from "../assets/images/logo.png"
import * as RiIcons from 'react-icons/ri';
import { useSelector } from "react-redux";

export default function BusinessSection() {
    const activeUser = useSelector((state) => state.login.activeUser);
    return (

        <div style={{
            position: "absolute", left: 0, bottom: 0, width:
                "100%", margin: "0px", display: "flex", marginBottom: "10px" 
        }}>

            <div style={{
                display: "flex", background: "#54068D", borderRadius: "10px",
                flexDirection: "row", padding: "10px", width: "90%", cursor: "pointer",
                gap: "10px", alignItems: "center", margin: "auto",
                marginLeft: "11px", justifyContent:"space-between"
            }}>

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
                    <Typography style={{ fontSize: "13px", fontWeight: "bold", color: "white" }}> {activeUser?.business?.businessName}</Typography>
                    <Typography style={{ fontSize: "13px", color: "#975EC0" }}> 252 616549198</Typography>
                </div>

                <RiIcons.RiArrowDownSFill style={{ fontSize: "20px",  color: "white" }} />,

            </div>
        </div>
    )
}

// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import Fade from '@mui/material/Fade';

// export default function FadeMenu() {
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <div>
//       <Button
//         id="fade-button"
//         aria-controls={open ? 'fade-menu' : undefined}
//         aria-haspopup="true"
//         aria-expanded={open ? 'true' : undefined}
//         onClick={handleClick}
//       >
//         Dashboard
//       </Button>
//       <Menu
//         id="fade-menu"
//         MenuListProps={{
//           'aria-labelledby': 'fade-button',
//         }}
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         TransitionComponent={Fade}
//       >
//         <MenuItem onClick={handleClose}>Profile</MenuItem>
//         <MenuItem onClick={handleClose}>My account</MenuItem>
//         <MenuItem onClick={handleClose}>Logout</MenuItem>
//       </Menu>
//     </div>
//   );
// }