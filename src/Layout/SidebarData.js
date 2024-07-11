import React from 'react';
import * as RiIcons from 'react-icons/ri';
import DashboardIcon from "@material-ui/icons/Dashboard";
import GroupIcon from "@material-ui/icons/Group";
import { VscPerson } from "react-icons/vsc";
import { MdOutlineAdminPanelSettings, MdOutlineFileDownload, MdPointOfSale, MdProductionQuantityLimits } from 'react-icons/md';
import { BiPurchaseTagAlt, BiWallet } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";

export const SidebarData = [
  {
    text: "Dashboard",
    icon: <DashboardIcon style={{fontSize: "20px",}} />,
    path: "/dashboard",
  },
  {
    text: "Sales",
    icon: <MdPointOfSale  style={{fontSize: "20px",}} />,
    path: "/sales",
  },

  {
    text: "Products",
    icon: <MdProductionQuantityLimits  style={{fontSize: "20px",}} />,
    path: "/products",
  },

  {
    text: "Purchases",
    icon: <BiPurchaseTagAlt  style={{fontSize: "20px",}} />,
    path: "/purchases",
  },

  {
    text: "Expenses",
    icon: <BiWallet   style={{fontSize: "20px",}} />,
    path: "/expenses",
  },

  {
    text: "Customers",
    icon: <GroupIcon style={{fontSize: "20px", }} />,
    path: "/customers",
  },
  
  {
    text: "Vendors",
    icon: <VscPerson style={{fontSize: "20px",}} />,
    path: "/vendors",
  },
 
  {
    text: "Reports",
    icon: <HiOutlineDocumentReport   style={{fontSize: "20px",}} />,
    path: "/reports",
  },

  {
    text: "Adminstration",
    icon: <MdOutlineAdminPanelSettings  style={{fontSize: "20px",}} />,
    path: "/adminstration",
  },
  {
    text: 'Import Data',
    path: '/import',
    icon: <MdOutlineFileDownload   style={{fontSize: "20px", }} />
  }
];
