import { useContext,useEffect,useState } from "react"
import { Nightsetting } from "./dashboard"
import { Page } from "./pager"
import { Loading_animation } from "./serchStyle";
import { No_Data_animation } from "./serchStyle";
import axios from "axios";

export function Invoice_table(){

    const {nightMode} = useContext(Nightsetting);
    const {set_refresh2,refresh2,set_invoce_content,loading,invoice_content} = useContext(Page)

    async function getting_invoices(){
        const response = await axios.get("http://localhost:5000/invoices",{withCredentials:true});
        set_invoce_content(response.data);
    }

    useEffect(() =>{
        getting_invoices()
    },[refresh2])

    function deleting(id){
        try {
        axios.delete("http://localhost:5000/invoices",{data:{id:id},withCredentials:true})
        .then(res => console.log(res.data))
        .catch(err => console.log("error deleting data",err)
        )
        set_invoce_content(items => items.filter(item => Number(item.id) !== Number(id)))
        set_refresh2(x => !x)
        } catch (error) {
            console.log("error in deleting invoice function",error);
        }
    }

    const delete_button = {
        backgroundColor:nightMode ? "hsl(209, 100%, 30%)":"hsl(0, 0%, 85%)",
        width: "70px",
        height: "30px",
        border:"none",
        padding:"2px 0px",
        borderRadius:"10px",
    }

    const table_body = {
        transition:"background-color 0.25s",
        color:nightMode?"white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
        width:"600px",
        height:"400px"
    }

    const page = loading? 
        <tbody><tr><td>
            <Loading_animation/>
        </td></tr></tbody>: <>
                <thead>
                    <tr style={{borderBottom: nightMode ?"2px solid white":" 2px solid hsl(0, 0%, 0%)"}}>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice_content.length == 0 ? 
                    <tr>
                        <td>
                           <No_Data_animation/> 
                        </td>
                    </tr>
                    :
                    invoice_content.map((row,idx) => (
                        <tr key={row.id} style={{borderBottom: nightMode ?"1px solid white":" 1px solid hsl(0, 0%, 0%)"}} id={row.id}>
                            <td>{row.client}</td>
                            <td>{row.date_time?.slice(0,10)}</td>
                            <td>{row.amount}</td>
                            <td>{row.status}</td>
                            <td><button style={delete_button} onClick={() => deleting(row.id)}>Delete</button></td>
                        </tr>
                    ))   
                }
                </tbody>
        </>;

    return(

        <div className="board" style={table_body}>
            <p style={{justifySelf:"center",fontWeight:"bolder"}}>Invoice's</p>
            <table>

                {page}
            </table>
        </div>
    )
}