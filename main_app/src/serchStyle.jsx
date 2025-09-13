import { Nightsetting } from "./dashboard";
import { useContext } from "react";
import { Page } from "./pager";

export function Search({x,setter,refresher}) {

    const now = new Date()

    const year = now.getFullYear()

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const today = `${year}-${month}-${day}`; 
    const {nightMode} = useContext(Nightsetting);
    const {search_type , setType,set_loading} = useContext(Page);

    

    const fcont = {
            display: " flex",
            justifyContent:"space-between",
            fontFamily:" 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"
    }

    const adding_style = {
        color:nightMode ? "white":"black",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
        transition:"background-color 0.25s",
        fontFamily:" 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"
    }

    const button_style = {
        color:nightMode ? "white":"black",
        backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",
        transition:"background-color 0.25s",
        borderRadius: "20px",
        fontFamily:" 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
        padding: "5px 5px"
    }

    const inputStyle = {
        color:nightMode ? "white":"black",
        backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",
        borderRadius:"20px",
        border:"none",
        padding:"2px 7px"
    }



        function seraching(){
        refresher(x => !x);
        set_loading(true);
        setTimeout(() => {
        set_loading(false);
        
        switch (search_type) {
            case "date":
                const date = document.getElementById("search2");
                setter(items => items.filter(item => String(item.date_time).slice(0,10) <= String(date.value)))
                break;
                case "number":
                    const number = document.getElementById("search1");
                    setter(items => items.filter(item => Number(item.amount) <= Number(number.value)))
                    break;
                        case "Type":
                            const type = document.getElementById("search-t");
                            setter(items => items.filter(item => (String(x == "status"?item.status :item.type_)) == String(type.value)))
                            break;
            default:
                console.log("error");
                break;
        }
        },1000)
    }
        
    return(
        <>
            <div style={fcont}>
                <p>Filter</p>
                <select style={adding_style} id="filter" onChange={(e) => {setType(e.target.value);}}>
                <option id="the_date" value="date">Search By Date</option>
                <option id="the_amount" value="number">Search By Amount</option>
                <option id="the_type" value="Type">Search By Type</option>
                </select>
            </div>
            <br/>
            <div style={fcont}>
                {search_type == "Type" ? (
                    <select id="search-t" style={inputStyle}>
                        <option value={x == "status"? "Paid":"income"}>{x == "status"?"Paid":"Income"}</option>
                        <option value={x == "status"?"Unpaid":"expense"}>{x == "status"?"Unpaid":"Expense"}</option>
                    </select>
                ):( search_type == "number" ? 
                    <input id="search1" style={inputStyle} type={search_type} min={0}/>:
                    search_type == "date" ? 
                    <input id="search2" style={inputStyle} type={search_type} defaultValue={today} /> 
                    :null)}
                <button style={button_style} onClick={seraching}>search</button>
            </div>
        </>
    )
}

export function No_Data_animation() {
    return(
    <>
                        <div className="loading">
                        <p style={{fontFamily:" 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"}}>No Avalable Data Here</p>
                        <div id="no_data"></div>
                        </div>
    </>
    )
}

export function Loading_animation(){
    return(
    <div className="loading">
        <p style={{fontFamily:" 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"}}>Loading</p>
        <div id="container1">
            <div className="orbs" style={{backgroundColor:"blue"}} id="orbit1"/>
            <div className="orbs" style={{backgroundColor:"black"}} id="orbit2"/>
        </div>
    </div> 
    )
}