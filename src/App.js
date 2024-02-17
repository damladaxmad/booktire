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
import {pages} from "./RoutesData.js";

function App() {
  const isLogin = useSelector((state) => state.login.isLogin);
  const [showLayout, setShowLayout] = useState(isLogin);
  const activeUser = useSelector((state) => state?.login?.activeUser);
  const [active, setActive] = useState();
  const [lacagtaBillah, setLacagtaBillaha] = useState(false)

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

  
  return (
    <div
      className="App"
      style={{
        backgroundColor: "#F8F2FE",
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
