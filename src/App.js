import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import SignupAndLogin from "./SignupAndLogin/SignupAndLogin";
import "./App.css";
import { useSelector } from "react-redux";
import NewLayout from "./Layout/Layout.js";
import Billing from "./containers/Billing.js";
import io from 'socket.io-client';
import {pages} from "./RoutesData.js";
import { setSocketId } from "./SignupAndLogin/loginSlice.js";
import { constants } from "./Helpers/constantsFile.js";

function App() {
  const isLogin = useSelector((state) => state.login.isLogin);
  const [showLayout, setShowLayout] = useState(isLogin);
  const activeUser = useSelector((state) => state?.login?.activeUser);
  const [active, setActive] = useState();
  const [lacagtaBillah, setLacagtaBillaha] = useState(false)

  const dispatch = useDispatch()

  const showHandler = (user) => {
    setTimeout(() => {
      if (user?.notify === "loop" || user?.notify == "stuck") {
        setLacagtaBillaha(true)
      }
      setShowLayout(true);
    }, 1000);
    setShowLayout(true);
  };

  useEffect(() => {
    setShowLayout(isLogin);
  }, [isLogin]);

  useEffect(() => {
    const socket = io.connect('https://booktire-api.onrender.com');

    socket.on('connect', () => {
      console.log('Connected to server');
      dispatch(setSocketId(socket?.id))
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  
  return (
    <div
      className="App"
      style={{
        backgroundColor: constants.backdropColor,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {lacagtaBillah && <Billing hideModal = {()=> {
        setLacagtaBillaha(false)
      }} fee = {activeUser?.fee}/>}
      <Router>
        {!showLayout && (
          <Route
            path="/signup"
            element={<SignupAndLogin showHandler={showHandler} />}
          />
        )}
        {showLayout && (
          <NewLayout
            active={(data) => {
              setActive(data);
            }}
          >
            <Routes>{pages?.map((page) => page)}</Routes>
          </NewLayout>
        )}
      </Router>
    </div>
  );
}

export default App;
