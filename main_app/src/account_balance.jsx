import { useContext } from "react";
import { Nightsetting } from "./dashboard"
import { Page } from "./pager";

export function Account_balance(){
    const {nightMode} = useContext(Nightsetting);
    const {balance,userSelect1} = useContext(Page)
    
    
    const account = localStorage.getItem("card_name");

    const Dcont1_style = {
        width:"220px",
        height:userSelect1 == "client"?"100px":"175px",
        transition:"background-color 0.25s",
        color:nightMode ? "white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
    }

    return(
        <div className="board" style={Dcont1_style}>
            <div className="fcont">
                <p>Account</p>
                <p>{account == null? "NONE":account}</p>
            </div>
            <div className="fcont">
                <p>Balance</p>
                <p>${balance}</p>
            </div>
        </div>
    )
}