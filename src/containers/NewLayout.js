import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { makeStyles } from "@material-ui/core";
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import DashboardIcon from "@material-ui/icons/Dashboard";
import { SiStylelint } from "react-icons/si"; 
import { VscPerson } from "react-icons/vsc";
import { MdOutlineMenuBook } from "react-icons/md";
import GroupIcon from "@material-ui/icons/Group";
import { MdAdminPanelSettings } from "react-icons/md"; 
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate, useLocation } from "react-router-dom";
import { MdMenuOpen } from "react-icons/md"; 
import { IoWalletOutline } from "react-icons/io5"; 
import { FiMenu } from "react-icons/fi"; 
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FaClipboardList } from "react-icons/fa"; 
import { MdBorderColor } from "react-icons/md"; 
import AppBarFile from './AppBarContainers/AppBar';
import femaleProfile from "../assets/images/fitCasriLogo1.jpg";
import { useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
// import InboxIcon from '@mui/icons-material/MoveToInbox';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  background: "white",
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  background: "white",
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  background: "white",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  background: "white",
  color: "black",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
    marginRight: "0px"
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
   
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
      marginRight: "0px"
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const useStyles = makeStyles((theme) => {
    return {
      active: {
        borderRight: "2px solid white",
        height: "40px",
        padding: "0px 15px",
      },
      inActive: {
        opacity: 0.6,
        padding: "0px 15px",
        height: "40px",
      }, 

      drawerPaper: {
        width: drawerWidth,
        color: "#FFFFFF",
        fontSize: "5px",
        background: "#0DCBDE",
      },
  
    };
  });


const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon style={{fontSize: "20px", color: "#130F26" }} />,
      path: "/dashboard",
    },
 
    {
      text: "Adminstration",
      icon: <MdAdminPanelSettings style={{fontSize: "20px", color: "#130F26" }} />,
      path: "/adminstration",
    },
    {
      text: "Import Excel",
      icon: <MdAdminPanelSettings style={{fontSize: "20px", color: "#130F26" }} />,
      path: "/excel",
    },
    {
      text: "Send Sms",
      icon: <MdAdminPanelSettings style={{fontSize: "20px", color: "#130F26" }} />,
      path: "/sms",
    },

    {
      text: "Calculator",
      icon: <MdAdminPanelSettings style={{fontSize: "20px", color: "#130F26" }} />,
      path: "/calculator",
    },
  

 
         
  ];

export default function NewLayout({children}) {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const companyInfo = useSelector(state => state.companyInfo.companyInfo)
  const activeUser = useSelector(state => state.activeUser.activeUser)
  const [show, setShow] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleShow = (location) => {
    if (location == "/") setShow(true)
    if (location !== "/") setShow(false)
  }

  const setNavigation = () => {
    navigate("/")
  }

  React.useEffect(()=> {
    handleShow(location.pathname)
  }, [location])

  return (
    <div style={{   display: "flex",
    width: "100%" }}>
      {/* <CssBaseline /> */}
      <AppBar position="fixed" open={open} style={{
        padding : '0px', 
        margin: '0px',
        display: "flex",
        width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
        flexDirection: "row",
        justifyContent:"space-between",
      }}
      >
        <Toolbar 
      style = {{display: "flex", 
       justifyContent: !open && "space-between",
       }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <FiMenu />
          </IconButton>
        </Toolbar>
          <AppBarFile open = {open} setNavigation = {setNavigation}/>
      </AppBar>

      
      <Drawer variant="permanent" open={open}
       classes={{ paper: classes.drawerPaper }}>
        <DrawerHeader>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: "2px",
            gap: "12px"
          }}
        >

          <Typography  style = {{fontSize:"18px",
        color: "#19274B", fontWeight: "600", marginLeft: "12px"}}>
         DeenTire Admin
            {/* {companyInfo ? companyInfo?.name?.substring(0, 13) : "Company Name"}{companyInfo ? companyInfo?.name?.length <= 12 ? null : "..." : null} */}
          </Typography>
         
       
          <IconButton onClick={handleDrawerClose} >
            {theme.direction === 'rtl' ? <MdMenuOpen 
            style={{color: "#19274B", fontSize: "15px"}}/> : <MdMenuOpen 
            style={{color: "#19274B"}}/>}
          </IconButton>
          </div>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item, index) => {
              
           return <ListItem
              button
              key={index}
              onClick={() => {
                navigate(item.path)
              }}
              classes={{
                primary: classes.fontSize,
              }}
              className={
                location.pathname === item.path
                  ? classes.active
                  : classes.inActive
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} 
              style = {{color: location.pathname == item.path ? "#171717;" : "#19274B"}}/>
            </ListItem>
            
      })}
        </List>
      
      </Drawer>
      <div style={{width: "90%", margin: "100px auto",
       marginTop: "100px"}}>
        {children}
        {show && <h2 style={{margin:"-5px 30px",}}>
            Hello {activeUser.name},  Welcome Back!!</h2>}
      </div>
    </div>
  );
}
