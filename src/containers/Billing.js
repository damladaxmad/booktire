import { Button, Divider, Typography } from "@material-ui/core";
import MyModal from "../Modal/Modal";
import { MdCheckBox } from "react-icons/md";
import { RiWallet3Fill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { FaMoneyBillAlt } from "react-icons/fa";
import moment from "moment";

const parentDivStyle = {
  width: "350px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "10px",
};

const Billing = (props) => {
    const today = new Date()
    console.log(today)
  return (
    <MyModal onClose={props.hideModal} width="350px" top="30%">
      <div style={parentDivStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end"
            }}
          >
          <div style = {{display: "flex", flexDirection: "row", gap: "10px",
        }}>
            <FaMoneyBillAlt style = {{fontSize: "24px",
             color: "#03656F",}}/>
            <Typography style={{ fontSize: "17px", fontWeight: "bold" }}>
              Lacag Bixinta Billaha
            </Typography>
</div>

            <Typography
              style={{ fontSize: "17px", fontWeight: "bold", color: "#03656F" }}
            >
              {props.fee}
            </Typography>
          </div>
          <Divider style={{ width: "100%" }} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "start",
          }}
        >
            <Typography style = {{textAlign: "justify", fontSize: "16px"}}>
          Mudane <span
              style={{ color: "#03656F", fontSize: "16px", fontWeight: "bold" }}
            >
              {props.data?.name}
            </span> Waxaa la gaaray xilligi lacag bixinta billaha, waxaan
          kaa codsaneynaa in aad si dhaqso leh ku bixiso lacagta. <span
              style={{ color: "#03656F", fontSize: "16px", fontWeight: "bold" }}
            >
              {moment(today).format("DD-MM-YYYY")}
            </span></Typography>
        </div>

        <Button
          onClick={props.hideModal}
          style={{
            width: "100%",
            marginLeft: "auto",
            fontSize: "16px",
            backgroundColor: "#03656F",
            fontWeight: "600",
            color: "white",
            height: "35px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          OK
        </Button>
      </div>
    </MyModal>
  );
};

export default Billing;