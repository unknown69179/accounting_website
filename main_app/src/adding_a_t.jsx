import { useContext} from "react";
import { Nightsetting } from "./dashboard";
import { adding_panel } from "./transaction";
import { Page } from "./pager";
import { Search } from "./serchStyle";

export function Adding_t(){

  
    const {setshow} = useContext(adding_panel);
    const {set_data_content,data_content,set_refresh,loading,isDisabled,} = useContext(Page);
    const {nightMode} = useContext(Nightsetting);

    const bodystyle = {
        width:"300px",
        color:nightMode ? "white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
        transition:"background-color 0.25s",
        display:"flex",
        flexDirection:"column",
        padding:"10px 20px"
    }

    const fcont = {
            display: " flex",
            justifyContent:"space-between",
            fontFamily:" 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"
    }

    const add_button_style = {
        color:nightMode ? "white":"black",
        backgroundColor: nightMode ? "hsl(278, 100%, 50%)":"hsl(278, 100%, 70%)",
        transition:"background-color 0.25s",
        borderRadius: "20px",
        fontFamily:" 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
        padding: "5px 5px"
    }

    let sum = null

    if (loading)
        sum = 0;
    else{
        for(let i = 0; i < data_content.length;i++){
            if (data_content[i].type_ =="income"){
                sum += Number(data_content[i].amount);
                console.log(Number(data_content[i].amount));}
                
            else
                sum -= Number(data_content[i].amount)
        }
    }

    return(
        <>
        <div className="board" style={bodystyle}>
            <Search x={"transaction"} setter={set_data_content} refresher={set_refresh}/>
            <br/>
            <button style={add_button_style} onClick={() => setshow(true)} disabled={isDisabled}>+ Add Transaction</button>
            <br/>
            <div style={fcont}>
                <p style={{fontFamily:" 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"}}>Net Balance</p>
                <p>{sum}</p>
            </div>
        </div>
        </>
    )
} 