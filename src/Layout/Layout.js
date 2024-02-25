import React, { useState } from "react"
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useNavigate, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import AppBarFile from '../containers/AppBarContainers/AppBar';
import { useEffect } from 'react';
import SubMenu from './SubMenu';
import logo from "../assets/images/logo.png"
import { Avatar } from '@mui/material';
import { SidebarData } from './SidebarData';
import BusinessSection from "./BusinessSection";
import { useSelector } from "react-redux";

const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  background: "#6A03B6",
  border: "none",
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  background: "#6A03B6",
  border: "none",
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
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  background: "white",
  boxShadow: '2px 0px 4px -1px rgba(0,0,0,0.2), 4px 0px 5px 0px rgba(0,0,0,0.14), 1px 0px 10px 0px rgba(0,0,0,0.12)',
  color: "black",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,

    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    background: "#6A03B6",
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


export default function NewLayout({ children, props }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false)
  const [open, setOpen] = React.useState(true);
  const activeUser = useSelector(state => state.login?.activeUser)

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (activeUser?.privileges?.includes("Dashboard"))
    navigate("/dashboard")
  }, [navigate])

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

  React.useEffect(() => {
    handleShow(location.pathname)
  }, [location])

  return (
    <div style={{
      display: "flex",
      width: "100%",
      background: "#F8F2FE"
    }}>
      <AppBar position="fixed" open={open} style={{
        padding: '0px',
        margin: '0px',
        display: "flex",
        width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
      >
        <Toolbar
          style={{
            display: "flex",
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
        <AppBarFile open={open} setNavigation={setNavigation} />
      </AppBar>


      <Drawer variant="permanent" open={open} style={{display: "flex", width: "260px",
    margin: "0px"}}>

        <DrawerHeader>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              paddingLeft: "2px",
              marginTop: "5px",
              gap: "12px",
            }}
          >

            <Avatar
              style={{ backgroundColor: "white", padding: "5px" }}
            >
              <img
                src={logo}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </Avatar>

            <div>
              <Typography style={{
                fontSize: "14px",
                color: "white", fontWeight: "600", marginLeft: "5px"
              }}>
                BOOKTIRE SYSTEM
              </Typography>
              <Typography style={{
                fontSize: "14px",
                color: "#CCBED6", fontWeight: "500", marginLeft: "5px"
              }}>
                BY TACABTIRE ICT
              </Typography>
            </div>

            {/*        
          <IconButton onClick={handleDrawerClose} >
            {theme.direction === 'rtl' ? <MdMenuOpen 
            style={{color: "#19274B", fontSize: "15px"}}/> : <MdMenuOpen 
            style={{color: "#19274B"}}/>}
          </IconButton> */}
          </div>
        </DrawerHeader>
      
        <List>
          {SidebarData.map((item, index) => {
            if (activeUser?.privileges?.includes(item.text) || activeUser?.username == "abc")
            return <SubMenu item={item} key={index} onTabClick/>
          })}
        </List>

          <BusinessSection/>

      </Drawer>
      <div style={{
        width: "90%", margin: "85px auto",
        marginTop: "100px", background:"#F8F2FE"
      }}>
        {location?.path == "/" && <Typography style = {{marginLeft:"20px",
      fontSize: "18px"}}> Hello {activeUser?.name}, welcome back!</Typography>}
        {children}
      </div>
    </div>
  );
}
