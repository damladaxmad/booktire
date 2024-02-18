import { Typography } from "@mui/material"
import CustomButton from "./CustomButton"
import { constants } from "../Helpers/constantsFile"
import { MdAdd } from "react-icons/md"

const secondarDivStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    margin: "auto",
  }
  

export default function TitleComponent ({title, btnName, onClick}) {

    return (
        <div style={secondarDivStyle}>

        <Typography style={{ fontWeight: "600", fontSize: "25px" }}>
          {title}</Typography>

        <CustomButton bgColor={constants.pColor}
          startIcon={<MdAdd
            style={{
              color: "white",
            }}
          />}
          text={btnName} fontSize="13px"
          onClick={onClick}
        />
      </div>
    )
}