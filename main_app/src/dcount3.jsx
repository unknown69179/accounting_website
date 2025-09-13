import { useContext } from "react"
import { Nightsetting } from "./dashboard"
import { Chart } from "./char"
import { Page } from "./pager"
import { Account_balance } from "./account_balance"

export function Dcount3(){

    let Revenue = 0
    let expense = 0
    
    const {nightMode} = useContext(Nightsetting);
    const {data_content} = useContext(Page);
    
    
    for(let i = 0; i < data_content.length;i++){
        if (data_content[i].type_ =="income"){
            Revenue += Number(data_content[i].amount);}
            
            else
                expense += Number(data_content[i].amount)
        }
        let net = Revenue - expense;
        
    

        const Dcont1_style = {
        width:"220px",
        height:"175px",
        transition:"background-color 0.25s",
        color:nightMode ? "white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
    }

        const pcont = {
            display: " flex",
            justifyContent:"space-between",
            fontFamily:" 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"
        } 

    return(
        <>
        <div style={{display:"flex",flexDirection:"column"}}>
            <Chart/>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
            <div className="board" style={Dcont1_style}>
                <div style={pcont}>
                <p>Total Income</p>
                <p>{`$${Revenue}`}</p>
                </div>
                <div style={pcont}>
                <p>Total Expenses</p>
                <p>{`$${expense}`}</p>
                </div>
                <div style={pcont}>
                <p>Net Profit</p>
                <p>{`$${net}`}</p>
                </div>
            </div>
            <Account_balance/>
            </div>
        </div>
        </>
    )
}