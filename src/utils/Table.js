import React, { useState } from "react";
import MaterialTable from "material-table";
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { forwardRef } from 'react';
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { MenuItem, Menu } from "@material-ui/core";

const Table = ({ name, data, columns, state, onUpdate, onDelete, onSeeTransactions, onResetUser,
onGiveAccess, onClickRow }) => {
  const tableIcons = {
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [instance, setInstance] = useState("");

  const handleClick = (
    event,
    instance
  ) => {
    setAnchorEl(event.currentTarget);
    setInstance(instance);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ width: "100%", margin: "auto" }}>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        style={{ marginTop: "25px" }}
      >

        <MenuItem
          onClick={() => {
            handleClose()
            onUpdate(instance)
          }}
        >
          Update {name}
        </MenuItem>

        {(name == "Customer" || name == "Vendor") && (<MenuItem
          onClick={() => {
            handleClose()
            onSeeTransactions(instance)
          }}
        >
          See Transactions
        </MenuItem>)}

        {(name == "User" ) && (<MenuItem
          onClick={() => {
            handleClose()
            onResetUser(instance)
          }}
        >
          Reset User
        </MenuItem>)}

        {(name == "User" ) && (<MenuItem
          onClick={() => {
            handleClose()
            onGiveAccess(instance)
          }}
        >
          Give Access
        </MenuItem>)}

        <MenuItem
          onClick={() => {
            handleClose()
            onDelete(instance)
          }}
        >
          Delete {name}
        </MenuItem>

      </Menu>

      <MaterialTable
        icons={tableIcons}
        columns={columns}
        data={data || []}
        localization={{
          body: {
            emptyDataSourceMessage: state,
          },
        }}
        options={{
          rowStyle: {},
          padding: "20px",
          showTitle: false,
          exportButton: true,
          sorting: false,
          showTextRowsSelected: false,
          toolbar: false,
          pageSizeOptions: [2, 5, 8, 10, 20, 15, 50, 100],
          pageSize: 15,
          draggable: false,
          actionsColumnIndex: -1,
          headerStyle: { background: "#EFF0F6", fontSize: "13px", 
        padding: "0px", fontWeight: "bold" },
        }}
        actions={[
          {
            icon: () => (
              <BiDotsHorizontalRounded
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              />
            ),
            tooltip: "Actions",
            onClick: (event, rowData) => {
              handleClick(event, rowData);
            },
            position: "row",
          },
        ]}
        style={{ borderRadius: "10px", boxShadow: "none", }}
        onRowClick={(e, rowData) => {
        (name == "Customer" || name == "Vendor") && onClickRow(rowData)
      }}
      />
    </div>
  );
};

export default Table;
