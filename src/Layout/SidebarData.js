import React from 'react';
import * as RiIcons from 'react-icons/ri';
import DashboardIcon from "@material-ui/icons/Dashboard";
import GroupIcon from "@material-ui/icons/Group";
import { VscPerson } from "react-icons/vsc";
import { MdOutlineAdminPanelSettings, MdOutlineFileDownload, MdPointOfSale, MdProductionQuantityLimits } from 'react-icons/md';
import { BiPurchaseTagAlt } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";

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
    // iconClosed: <RiIcons.RiArrowDownSFill style={{fontSize: "20px", }}/>,
    // iconOpened: <RiIcons.RiArrowUpSFill style={{fontSize: "20px", }}/>,
    // subNav: [
    //   {
    //     text: 'Import Customers',
    //     path: '/customers/import',
    //     icon: <GroupIcon style={{fontSize: "20px", }} />
    //   }
    // ]
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
    text: "Vendors",
    icon: <VscPerson style={{fontSize: "20px",}} />,
    path: "/vendors",
  },
  {
    text: "Purchases",
    icon: <BiPurchaseTagAlt  style={{fontSize: "20px",}} />,
    path: "/purchases",
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
