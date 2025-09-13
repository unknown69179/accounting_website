import { useContext } from "react";
import { Nightsetting } from "./dashboard";

export function Bills(){

    const {nightMode} = useContext(Nightsetting);

    const button_style = {
        color:nightMode ? "white":"black",
        backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",
        transition:"background-color 0.25s",
        borderRadius: "20px",
        fontFamily:" 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
        padding: "5px 5px"
    }

    const Bills_style = {
        width:"600px",
        height:"430px",
        color:nightMode ? "white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
        transition:"background-color 0.25s",
        textAlign:"center"
    }

    const inputStyle = {
        color:nightMode ? "white":"black",
        borderRadius:"20px",
        backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",
        border:"none",
        padding:"2px 7px"
    }

    return(
        <div className="main_body">
            <div className="board" style={Bills_style}>
                <p>Bill's</p>
                <div className="fcont">
                    <input type="date" style={inputStyle}/>
                    <button style={button_style}>search</button>
                </div>
                <hr style={{height:"2px",backgroundColor:nightMode?"white":"black"}}/>
            </div>
        </div>
    )
}