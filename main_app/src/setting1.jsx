import React, { createContext, useContext, useEffect, useState } from "react";
import { Nightsetting } from "./dashboard"; 
import { Page } from "./pager";

export const ToggleContext = createContext({
  toggled1: false,
  set: () => {}
});

function Setting() {
  const { toggled1 = false, set = () => {} } = useContext(ToggleContext);
  const nightContext = useContext(Nightsetting) || {};
  const contextNightMode = typeof nightContext.nightMode === "boolean"? nightContext.nightMode: undefined;
  const contextSetNightMode = typeof nightContext.setNightMode === "function"? nightContext.setNightMode: undefined;
  const { page, setpage } = useContext(Page) || {};
  
  const [nightMode, setNightModeLocal] = useState(() => {
    const stored = localStorage.getItem("nightmode");
    if (stored !== null) return stored === "true";
    if (typeof contextNightMode === "boolean") return contextNightMode;
    return false;
  });

  useEffect(() => {
    const stored = localStorage.getItem("nightmode");
    if (stored === null && typeof contextNightMode === "boolean") {
      setNightModeLocal(contextNightMode);
    }
  }, []); 

  useEffect(() => {
    try {
      localStorage.setItem("nightmode", nightMode.toString());
    } catch (err) {
      console.warn("localStorage unavailable:", err);
    }
    if (contextSetNightMode) {
      contextSetNightMode(nightMode);
    }
  }, [nightMode, contextSetNightMode]);

  useEffect(() => {
    const domclick = (event) => {
      if (!event.target.closest("#s_body") && !event.target.closest("#settings")) {
        if (typeof set === "function") set(false);
      }
    };
    document.addEventListener("click", domclick);
    return () => {
      document.removeEventListener("click", domclick);
    };
  }, [toggled1, set]);

  const panelStyle = {
    backgroundColor: nightMode ? "hsl(209, 100%, 15%)" : "hsla(0, 1%, 72%, 1.00)",
    position: "fixed",
    right: "0",
    top: 0,
    height: "100vh",
    width: "230px",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.25s, background-color 0.25s",
    zIndex: 999,
    transform: toggled1 ? "translateX(0)" : "translateX(100%)"
  };

  const lightStyle = {
    borderRadius: "30px",
    marginLeft: "20px",
    backgroundColor: "hsl(0, 0%, 40%)",
    width: "40px",
    height: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "end"
  };

  const switchStyle = {
    backgroundColor: "white",
    height: "20px",
    width: "20px",
    borderRadius: "50%",
    transition: "transform 0.25s",
    transform: nightMode ? "translateX(-20px)" : "translateX(0)",
    cursor: "pointer"
  };

  const textStyle = { color: nightMode ? "white" : "black", margin: 0 };

  const toggleNightMode = (e) => {
    e.stopPropagation();
    setNightModeLocal((prev) => !prev);
  };

  return (
    <div id="s_body" style={panelStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }} className={`settingItems  ${nightMode? `night`:`day`}`}>
        <div style={lightStyle}>
          <div id="d" style={switchStyle} onClick={toggleNightMode} />
        </div>
        <p style={textStyle}>Night mode</p>
      </div>

      <div onClick={() => typeof setpage === "function" && setpage("profile")} style={{ textAlign: "center", cursor: "pointer" }} className={`settingItems  ${nightMode? `night`:`day`}`}>
        <p style={textStyle}>Profile</p>
      </div>
    </div>
  );
}

export default Setting;