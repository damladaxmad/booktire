import React, {  useState } from "react";
import {MdClose} from "react-icons/md"
import MaterialTable from "material-table";
import { constants } from "../Helpers/constantsFile";

const MyTable = (props) => {

  const columns = props.columns;

  let topValues = props.data?.sort((a,b) => b.balance-a.balance).slice(0,props.data?.length);

  return (
    <div style={{ width: props.page == "New Purchase" ? "98%" : 
    props.kind == "Report" ? "100%" : "95%", 
    margin: props.page == "New Purchase" ? "none" : "auto" }}>

      <MaterialTable
        columns={columns}
        data={topValues}
        options={{
          rowStyle: {},
          showTitle: false,
          paging: false,
          exportButton: true,
          sorting: false,
          showTextRowsSelected: false,
          toolbar: false,
          draggable: false,
          headerStyle: { display: "none"},
        }}

        components={
          props.kind == "Report" && {
          Row: (props) => {
            return (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent:"space-between",
                  borderBottom: "0.5px solid #E3E3E3",
                  padding: "8px 0px",
                  fontSize: 15,
                }}
              >
                
                <p style={{ margin: "0px", width: "35%",  }}>
                 {props.data.name} 
                </p>
                <p style={{ margin: "0px", width: "21%", textAlign: "end" }}>
                  { props.data.phone}
                </p>
                <p style={{ margin: "0px", width: "21%", textAlign: "end" }}>
                  { props.data.district}
                </p>
                <p style={{ margin: "0px", width: "21%", textAlign: "end" }}>
                  {constants.moneySign}{props.data.balance?.toFixed(2)}
                </p>
              </div>
            );
          },
        }}
        style={{ borderRadius: "10px", boxShadow: "none",
         border: "none"}}
      />
    </div>
  );
};

export default MyTable;
