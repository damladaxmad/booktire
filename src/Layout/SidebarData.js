import React from 'react';
import * as RiIcons from 'react-icons/ri';
import DashboardIcon from "@material-ui/icons/Dashboard";
import GroupIcon from "@material-ui/icons/Group";
import { VscPerson } from "react-icons/vsc";

export const SidebarData = [
  {
    text: "Dashboard",
    icon: <DashboardIcon style={{fontSize: "20px",}} />,
    path: "/dashboard",
  },

  {
    text: "Customers",
    icon: <GroupIcon style={{fontSize: "20px", }} />,
    path: "/customers",
    iconClosed: <RiIcons.RiArrowDownSFill style={{fontSize: "20px", }}/>,
    iconOpened: <RiIcons.RiArrowUpSFill style={{fontSize: "20px", }}/>,
    subNav: [
      {
        text: 'Import Customers',
        path: '/customers/import',
        icon: <GroupIcon style={{fontSize: "20px", }} />
      }
    ]
  },
  {
    text: "Vendors",
    icon: <VscPerson style={{fontSize: "20px",}} />,
    path: "/vendors",
  },
  {
    text: "Purchases",
    icon: <VscPerson style={{fontSize: "20px",}} />,
    path: "/purchases",
  },
  {
    text: "Sales",
    icon: <VscPerson style={{fontSize: "20px",}} />,
    path: "/sales",
  },
  {
    text: "Reports",
    icon: <VscPerson style={{fontSize: "20px",}} />,
    path: "/reports",
  },
  {
    text: "Adminstration",
    icon: <VscPerson style={{fontSize: "20px",}} />,
    path: "/adminstration",
  },
];
