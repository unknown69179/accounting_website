import { useContext , useEffect} from "react"
import { Nightsetting } from "./dashboard"
import { Page } from "./pager";
import axios from "axios";
import {No_Data_animation,Loading_animation} from "./serchStyle"

export function Dcont1(){

    const {nightMode} = useContext(Nightsetting);
    const {data_content,set_data_content,userSelect1,refresh} = useContext(Page);
    const {loading} = useContext(Page);

    
    function deleting(id){
        axios.delete("http://localhost:5000",{data: { id, userSelect1 },withCredentials:true})
        .catch(err => console.log("error deleting data",err)
        )
        set_data_content(items => items.filter(item => Number(item.id) !== Number(id)))

        setTimeout(() =>{
        },1000)
    }

    const fetching = async () => {
    try {
        const response = await axios.post("http://localhost:5000",{userSelect1},{withCredentials: true});
        set_data_content(response.data);

    } catch (err) {
        console.log("Error fetching data:", err);
    }
        }
    
        useEffect(() => {    
            fetching();
        },[refresh])

    const Dcont1_style = {
        width:"600px",
        height:"400px",
        color:nightMode ? "white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
        transition:"background-color 0.25s",
        textAlign:"center"
    }

    const tcolor = {
        color:nightMode ? "white":"black",
        backgroundColor: nightMode ? "hsl(209, 100%, 10%)" : "white",
        transition:"background-color 0.25s"
    }

    const btn_style = {
        color:nightMode ? "white":"black",
        padding:"5px 10px",
        borderRadius:"15px",
        backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",
    }

    const page = loading? 
    <tbody>
    <tr>
    <td>
        <Loading_animation/>
    </td>
    </tr>
    </tbody>
    : 
    <>
                        <thead>
                       <tr style={{borderBottom: nightMode ?"2px solid white":" 2px solid hsl(0, 0%, 0%)"}}>
                        <th  style={tcolor}>Date</th>
                        <th  style={tcolor}>Type</th>
                        <th  style={tcolor}>Account</th>
                        <th  style={tcolor}>Description</th>
                        <th  style={tcolor}>Amount</th>
                        <th  style={tcolor}>{}</th>
                    </tr> 
                    </thead>
                    <tbody>
                    {data_content.length === 0 ? <>     
                    <tr>
                        <td>                            
                            <No_Data_animation/>
                        </td>    
                    </tr>   
                    </> : data_content.map((row, idx) => (
                    
                                                    <tr key={row.id} style={{borderBottom: nightMode ?"1px solid white":" 1px solid hsl(0, 0%, 0%)"}} id={row.id}>
                                                    <td style={tcolor}>{row.date_time?.slice(0,10)}</td>
                                                    <td style={tcolor}>{row.type_}</td>
                                                    <td style={tcolor}>{row.account_}</td>
                                                    <td style={tcolor}>{row.description_}</td>
                                                    <td style={tcolor}>${row.amount}</td>
                                                    <td style={tcolor}><button style={btn_style} onClick={() => deleting(row.id)}>delete</button></td>
                                                    </tr>
                                                ))}
                    </tbody>
    </>
    return(
        <>
            <div className="board" style={Dcont1_style}>
                <p className="dp">Transactions</p>
                <table style={tcolor}>
                            {page}
                </table>
            </div>
        </>
    )
}