import { useContext,useState } from "react"
import { Nightsetting } from "./dashboard"
import { Invoice_table } from "./invoice_table"
import { Search } from "./serchStyle"
import { Page } from "./pager"
import axios from "axios"

export function Invoice(){

    const now = new Date()

    const year = now.getFullYear()

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const today = `${year}-${month}-${day}`;    

    const {nightMode} = useContext(Nightsetting);
    const {set_invoce_content,set_refresh2} = useContext(Page);
    const [show_invoce_panel,set_show_invoce_panel] = useState(false);
    const [date,setDate] = useState(today);
    const [show,setShow] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [message,setMessage] = useState("");

    function processing(e){
        e.preventDefault();
        setSubmitted(true);            

        const form = e.target;   
        const date = document.getElementById("date");
        const status = document.getElementById("status");
        const client = document.getElementById("client");
        const amount = document.getElementById("amount");
        const email = document.getElementById("email");
        const message = document.getElementById("message");

        const data = {
            date:date.value,
            status:status.value,
            client:client.value,
            amount:amount.value,
            email:email.value,
            message:message.value
        }

        if (!form.checkValidity()) {
        
        return;
        }

        try {
            const response = axios.post("http://localhost:5000/invoices",data,{withCredentials:true})
            .then(res => {
              if(res.data.message == "you can't send an invoce to your self"){
                setMessage(res.data.message);
              }
              else
              console.log(res.data)
            })
            .catch(err => console.log("erroe sending invoice",err))
            set_show_invoce_panel(false);
            set_refresh2(x => !x);
            
        } catch (error) {
            console.log("error in the invoce proccessing function",error);
        }
    }

    function deleteAll(){
        axios.delete("http://localhost:5000/invoices/all",{withCredentials:true})
        .catch(err => console.log("error deleting all",err))
        setShow(false);
        set_refresh2(x => !x);
    }

    const inputStyle = {
            color:nightMode ? "white":"black",
            borderRadius:"20px",
            backgroundColor:nightMode ? "hsl(209, 100%, 30%)":"hsl(0, 0%, 85%)",
            padding:"2px 0px",
            textAlign:"center",
            width:"200px",
            fontFamily:" 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            cursor:"pointer"
    }

    const table_adding = {
        transition:"background-color 0.25s",
        color:nightMode?"white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
        width:"300px",
        height:"200px"
    }

    const buttonStyle = {
        color: nightMode? "white" : "black",
        backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 85%)",
        width: "330px",
        height: "30px",
        border:"none",
        padding:"2px 0px",
        borderRadius:"15px",
    }

    const panel_style = {
            position:"absolute",
            color:nightMode ? "white":"black",
            backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",
            width:"300px",
            padding:"15px 30px"
    }

    const add_button = {
        backgroundColor: nightMode ? "hsl(278, 100%, 50%)":"hsl(278, 100%, 70%)",
        width: "70px",
        heght: "30px",
        border:"none",
        padding:"2px 0px",
        borderRadius:"10px",
    }

    const delete_button = {
        color:nightMode? "white":"black",
        backgroundColor:nightMode ? "hsl(209, 100%, 30%)":"hsl(0, 0%, 85%)",
        width: "70px",
        height: "30px",
        border:"none",
        padding:"2px 0px",
        borderRadius:"10px",
    }

    return(
        <>
        <div className="main_body">
            {show ? <div className="overlayStyle">
                <div className="board" style={panel_style}>
                    <p style={{justifySelf:"center"}}>Are You Sure?</p>
                    <div className="fcont">
                        <button style={delete_button} onClick={() => setShow(false)}>No</button>
                        <button style={delete_button} onClick={deleteAll}>Yes</button>
                    </div>
                </div>
            </div>:null}
            {show_invoce_panel? 
  <div className="overlayStyle">
  <div className="board" style={panel_style}>
    <form id="theForm" onSubmit={processing} className={submitted ? "submitted" : ""} noValidate onInput={() => setSubmitted(false)}>
      <div className="fcont">
        <br/>
        <p>Date</p>
        <input id="date" type="date" style={inputStyle} value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <hr/>
      <div className="fcont">
        <p>Status</p>
        <select id="status" style={inputStyle} required>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>
      <hr/>

      <div className="fcont">
        <p>Client</p>
        <input type="text" id="client" style={inputStyle} maxLength={30} required />
      </div>
      <hr/>

      <div className="fcont">
        <p>Amount</p>
        <input id="amount" type="number" step={0.01} style={inputStyle} min={0} required />
      </div>
      <hr/>
      <div className="fcont">
        <p>Message</p>
        <input id="message" type="text" maxLength={150} style={inputStyle} required placeholder="Hi Client" />
      </div>
      <hr/>
      <div className="fcont">
        <p>Email</p>
        <input id="email" type="email" style={inputStyle} placeholder="e.g. client@example.com" maxLength={50} required />
      </div>
      <br/>
      <div style={{display:"flex",justifyContent:"end",columnGap:"20px"}}>
        <button style={delete_button} type="button" onClick={() =>{setSubmitted(false); set_show_invoce_panel(false)}}>Cancel</button>
        <button style={add_button} type="submit">Send</button>
      </div>
    </form>
  </div>
</div>
:null}
        <div>
            <div className="board" style={table_adding}>
                <Search x={"status"} setter ={set_invoce_content} refresher={set_refresh2}/>
                <br/>
                <button style={{
                    color: nightMode? "white" : "black",
                    backgroundColor:nightMode ? "hsl(209, 100%, 15%)":"hsl(0, 0%, 80%)",
                    width: "300px",
                    height: "30px",
                    border:"none",
                    padding:"2px 0px",
                    borderRadius:"15px",
                }} onClick={() =>setShow(true)}>Cleare all invoices</button>
                <br/>
                <p style={{color:"red"}}>{message}</p>
            </div>
            <br/>
            <button style={buttonStyle} onClick={() =>set_show_invoce_panel(true)}>Send An Invoice</button>
        </div>
        <Invoice_table/>
        </div>
        </>
    )
}