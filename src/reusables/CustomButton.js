// CustomButton.js
import { Button } from '@mui/material';
import React from 'react';

const CustomButton = ({ bgColor, width, fontSize, startIcon, text, type = "", onClick }) => {
  return (
    <Button
      variant="contained"
      type = {type}
      style={{
        backgroundColor: bgColor,
        color: "white",
        height: "45px",
        fontSize: fontSize || "16px",
        width: width,
        fontWeight: "bold",
      }}
      onClick={onClick}
      startIcon={startIcon}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
