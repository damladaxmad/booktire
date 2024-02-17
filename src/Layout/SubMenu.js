import { Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import styles from './styles.module.css'


const SubMenu = ({ item }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => {
    setSubnav(!subnav)
  };

  const tabStyle = {
    display: "flex", flexDirection: "row",
    justifyContent: "space-between", color: "white",
    background: location.pathname.startsWith(item.path) && "#9300FF"
  }

  const subTabStyle = {
    display: "flex", flexDirection: "row", gap: "10px", marginLeft: "40px",
    color: "white", fontWeight: location.pathname === item.path && "bold",
    cursor: "pointer"
  }

  return (
    <>
      <div className={styles.container}
        style={tabStyle} onClick={() => {
          item.subNav && showSubnav()
          navigate(item.path)
        }}>
        <div style={{ display: "flex", gap: "15px" }}>
          {item.icon}
          <Typography> {item.text}</Typography>
        </div>

        {item.subNav && subnav
          ? item.iconOpened
          : item.subNav
            ? item.iconClosed
            : null}
      </div>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <div className={styles.subContainer}
              key = {index}
              style={subTabStyle} onClick={() => {
                navigate(item.path)
              }}>
              {item.icon}
              <Typography> {item.text}</Typography>
            </div>
          );
        })}
    </>
  );
};


export default SubMenu;
