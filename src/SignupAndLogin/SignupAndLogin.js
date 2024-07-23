import React from "react";
import Login from "./Login";
import { makeStyles } from '@material-ui/core/styles';
import hero from "../assets/images/booktireBackCrop.png"
import { constants } from "../Helpers/constantsFile";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  container: {
    display: 'flex',
    width: "100%",
    maxHeight: '100vh',
  },
  leftSide: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: "50%",
    padding: '40px',
    boxSizing: 'border-box',
  },
  rightSide: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: "50%",
  },
  '@keyframes scaleInOut': {
    '0%, 100%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
  },
  heroImage: {
    width: '100%',
    height: '75%',
    marginBottom: '20px',
    animation: '$scaleInOut 2s ease-in-out',
  },
  heroText: {
    fontSize: '22px',
    color: '#333',
    textAlign: 'center',
    // lineHeight: "1.7"
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '400px',
    maxWidth: '400px',
    gap: '16px',
    background: 'white',
    padding: '16px',
    borderRadius: '10px',
  },
  title: {
    margin: '0px',
    fontSize: '28px',
    fontWeight: '700',
    color: '#19274B',
  },
}));

const SignupAndLogin = (props) => {
  const classes = useStyles();

  const showHandler = () => {
    props.showHandler();
  }

  return (
    <div className={classes.container}>
      <div className={classes.leftSide}>
        <img src = {hero} alt="Hero" className={classes.heroImage} />
        <p className={classes.heroText}>
  Hey there, Welcome back to <span style={{ fontWeight: "bold", color: constants.pColor,
    textDecoration: "underline"
   }}>Booktire</span>
  <br />
  Please login to continue
</p>


        <Typography style = {{marginTop: "10px", color: "grey"}}>&copy; 2024 TACABTIRE ICT</Typography>
      </div>
      <div className={classes.rightSide} style = {{
        display: "flex", gap: "5px", flexDirection: "column"
      }}>
        <div className={classes.formContainer} style = {{marginTop: "40px"}}>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <p className={classes.title}>Login</p>
          </div>
          <Login showHandler={showHandler} />
        </div>
          <Typography style = {{fontWeight: "bold",
            fontSize: "15px", marginTop: "40px"
          }}> CONTACT US:</Typography>
          <Typography style = {{ fontSize: "15px"
           
          }}> 0616549198 / 0615753832</Typography>
      </div>
    </div>
  );
};

export default SignupAndLogin;
