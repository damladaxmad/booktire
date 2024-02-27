// CustomButton.js
import { Button } from '@mui/material';
import React from 'react';
import { constants } from '../Helpers/constantsFile';

const CustomButton = ({ bgColor = constants.pColor, color = "white", width, height = "40px", 
fontSize = "16px", disabled, startIcon, text = "Click", type, style, onClick }) => {
  
  return (
    <Button
      disabled = {disabled || false}
      variant="contained"
      type = {type}
      style={{
        backgroundColor: disabled ? "lightgray" : bgColor,
        color: color ,
        height: height ,
        fontSize: fontSize,
        width: width,
        fontWeight: "bold",
        ...style
      }}
      onClick={onClick}
      startIcon={startIcon}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
