import { Avatar, Typography, makeStyles } from "@material-ui/core";
import React, {useState} from "react";
import profile from "../../assets/images/blueProfile.webp";
import { MenuItem, Menu, ListItemIcon,} from "@material-ui/core"
import { useSelector, useDispatch } from "react-redux";
import { FiLogOut } from "react-icons/fi";  
import { AiOutlineEdit } from "react-icons/ai";  
import EditProfile from "./EditProfile";
import { logout } from "../../SignupAndLogin/loginSlice";
import { constants } from "../../Helpers/constantsFile";
import { logoutCustomers } from "../customer/customerSlice";
import { logoutProducts } from "../products/productSlice";
import ChangePassword from "./ChangePassword";
import { IoMdUnlock } from "react-icons/io";
import { logoutUsers } from "../user/userSlice";
import { logoutVendors } from "../vendor/vendorSlice";

const drawerWidth = 225;
const useStyles = makeStyles((theme) => {
  return {
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      color: "#041E42",
      backgroundColor: "#ffffff",
    },
    appBarTitle: {
      flexGrow: 1,
      fontWeight: "bold",
      fontSize: "26px",
    },
    avatar: {
      marginLeft: theme.spacing(2),
      cursor: "pointer",
    },
  };
});

const AppBarFile = (props) => {
  const dispatch = useDispatch()
  const activeUser = useSelector((state) => state.login.activeUser);
  const [showChangePassword, setShowChangePasswrd] = useState(false)
  const [show, setShow] = useState(false)
  
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    dispatch(logout(false))
    dispatch(logoutCustomers())
    dispatch(logoutProducts())
    dispatch(logoutVendors())
    dispatch(logoutUsers())
    props.setNavigation()
  }

  const editHandler = () => {
    setShow(true)
  }

  const hideModal = () => {
    setShow(false)
    setShowChangePasswrd(false)
  }

  return (

    <>
      {show && <EditProfile user = {activeUser} hideModal = {hideModal} logoutHandler = {logoutHandler}/>}
      {showChangePassword && <ChangePassword user = {activeUser} hideModal = {hideModal}
      logoutHandler = {logoutHandler}/>}
      <div style = {{
        marginRight: "2%", display: "flex",
        alignItems: "center",}}>

        <Typography style = {{fontWeight: "500", marginRight: "10px"}}>
       {activeUser ? activeUser.name : "Ahmed Ali"}
        </Typography>
        <Avatar
          className={classes.avatar}
          style={{ backgroundColor: "#041E42", 
        }}
          onClick={handleClick}
        >
          <img
            src={profile}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Avatar>
      </div>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        style={{marginTop:"35px"}}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
       
        <MenuItem onClick={editHandler}>
          <ListItemIcon>
            <AiOutlineEdit fontSize="medium" style={{color: "black"}}/>
          </ListItemIcon>
          Edit Profile
        </MenuItem>

        <MenuItem onClick={()=> setShowChangePasswrd(true)}>
          <ListItemIcon>
            <IoMdUnlock  fontSize="medium" style={{color: "black"}}/>
          </ListItemIcon>
          Bedel Pin-ka
        </MenuItem>

        <MenuItem onClick = {logoutHandler}>
          <ListItemIcon>
            <FiLogOut fontSize="medium" style={{color: "black"}} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      </>
  );
};

export default AppBarFile;
