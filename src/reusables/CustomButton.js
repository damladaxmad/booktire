// CustomButton.js
import { Button } from '@mui/material';
import React from 'react';
import { constants } from '../Helpers/constantsFile';

const CustomButton = ({ bgColor = constants.pColor, color, width, height, fontSize,
  disabled, startIcon, text = "Click", type, style, onClick }) => {
  return (
    <Button
      disabled = {disabled || false}
      variant="contained"
      type = {type}
      style={{
        backgroundColor: disabled ? "lightgray" : bgColor,
        color: color || "white",
        height: height || "40px",
        fontSize: fontSize || "16px",
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
