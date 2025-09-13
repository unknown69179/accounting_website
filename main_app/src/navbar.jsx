import React, { useState , useContext} from "react";
import { Nightsetting } from "./dashboard";
import Setting, { ToggleContext } from "./setting1";
import { Page } from "./pager";

function Navbar() {

  const {setpage,userSelect1} = useContext(Page)

  const [toggled1, set] = useState(false);

  const {nightMode} = useContext(Nightsetting);

  if (nightMode == false){
    document.body.style.backgroundColor = "white";
  } 
  else {
    document.body.style.backgroundColor = "hsl(209, 100%, 12%)";
  }

  const navstyle = {
        color:nightMode ? "white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 30px grey",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
        transition:"background-color 0.25s"
  }

  return (
    <div id="nav-container" style={navstyle}>
      <img id="logo" src="src/assets/logo.png" alt="logo" />
      <div id="options">
        {userSelect1 == "client"? 
        <>
        <div className={`option ${nightMode? `night`:`day`}`} onClick={() => setpage("D_Body2")}>Dashboard</div>
        <div className={`option ${nightMode? `night`:`day`}`} onClick={() => setpage("Transaction")}>Transaction</div>
        <div className={`option ${nightMode? `night`:`day`}`} onClick={() => setpage("mailbox")}>Mailbox</div>
        </>
        :
        <>
        <div className={`option ${nightMode? `night`:`day`}`} onClick={() => setpage("D_Body")}>Dashboard</div>
        <div className={`option ${nightMode? `night`:`day`}`} onClick={() => setpage("Transaction")}>Transaction</div>
        <div className={`option ${nightMode? `night`:`day`}`} onClick={() => setpage("Invoice")}>Invoice</div>
        <div className={`option ${nightMode? `night`:`day`}`} onClick={() => setpage("Bills")}>Bills</div>
        <div className={`option ${nightMode? `night`:`day`}`} onClick={() => setpage("Report's")}>Reports</div>
        </>}
      </div>

      <ToggleContext.Provider value={{ toggled1, set }}>
        <div id="settings" onClick={() => set(prev => !prev)} style={{ cursor: "pointer" }}>⚙</div>
        <Setting />
      </ToggleContext.Provider>
    </div>
  );
}

export default Navbar;