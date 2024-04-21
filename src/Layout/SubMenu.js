import { Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import styles from './styles.module.css';
import { constants } from '../Helpers/constantsFile';

const SubMenu = ({ item }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [subnav, setSubnav] = useState(false);

  // Determine if the current tab is active
  const isActive = location.pathname.startsWith(item.path);

  const tabStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    color: "white",
    // background: isActive && "#9300FF"
    background: isActive && constants.activeTabColor
  };

  const subTabStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    marginLeft: "40px",
    color: "white",
    fontWeight: isActive && "bold",
    cursor: "pointer"
  };

  // Show subnav when the tab is active
  React.useEffect(() => {
    if (isActive) {
      setSubnav(true);
    } else {
      setSubnav(false);
    }
  }, [isActive]);

  return (
    <>
      <div className={styles.container}
        style={tabStyle} onClick={() => {
          navigate(item.path);
        }}>
        <div style={{ display: "flex", gap: "15px" }} onClick={() => {
          // Only toggle subnav state when clicking on the icon
          if (item.subNav) {
            setSubnav(!subnav);
          }
        }}>
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
        item.subNav?.map((subItem, index) => { // <-- Optional chaining added here
          // Only render subtab if the parent tab is active
          return isActive && (
            <div className={styles.subContainer}
              key={index}
              style={subTabStyle} onClick={() => {
                navigate(subItem.path);
              }}>
              {subItem.icon}
              <Typography> {subItem.text}</Typography>
            </div>
          );
        })}
    </>
  );
};

export default SubMenu;
