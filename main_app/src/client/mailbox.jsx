import { useStripe } from "@stripe/react-stripe-js";
import { useState,useContext } from "react";
import { Nightsetting } from "../dashboard";
import { No_Data_animation,Loading_animation} from "../serchStyle";
import { useEffect } from "react";
import { Date_Search } from "../date_search";
import axios from "axios";


export function Mailbox(){
    const stripe = useStripe();
    
    const now = new Date()

    const year = now.getFullYear()

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const today = `${year}-${month}-${day}`; 

    const {nightMode} = useContext(Nightsetting);
    const [mail_refreasher,set_mail_refreasher] = useState(false)
    const [charging,setCharging] = useState(false);
    const [emesage,setEmessage] = useState("")

    const [mails,setMails] = useState([]);
    const [loading,setLoading] = useState(false);
    const [showInfo,setShowInfo] = useState(false);
    const [showMessage,setShowMessage] = useState(false);
    const [data,setdata] = useState([]);

    async function getMail(){
        const response = await axios.get("http://localhost:5000/getMail",{withCredentials:true}).catch(err => console.log("error getting mail in F.E"));
        console.log(response.data);
        setMails(response.data);
    }

    async function Pay(email,amount,id,date){
        setCharging(true);

        try{
            const response = await axios.post("http://localhost:5000/pay",{email,amount,date},{withCredentials:true})
        }
catch (err) {
    const data = err?.response?.data;
    if (data?.requires_action && data.payment_intent_client_secret) {
      try {
        setEmessage("Authentication required — opening 3DS...");
        const confirmResult = await stripe.confirmCardPayment(data.payment_intent_client_secret);
        if (confirmResult.error) {
          setEmessage("Authentication failed: " + confirmResult.error.message);
        } else {
          setEmessage("Payment completed after authentication ✅");
        }
      } catch (confirmErr) {
        console.error("confirmCardPayment error", confirmErr);
        setEmessage("Error during authentication");
      }
    } else {
      console.error("paySavedCard error:", err);
      setEmessage((data && data.error) || err.message || "Payment error");
    }
  } finally {
    setCharging(false);
  }

  const response2 = await axios.delete("http://localhost:5000/deleteMail",{data: { id },withCredentials:true}).catch(err => console.log("error deleting message"));
  if(response2.data.success){
    getMail()
  }
    }

    async function SendMail(e) {
        e.preventDefault();
        const message = e.target.message.value;
        const email = data[0];
        const response = await axios.post("http://localhost:5000/sendMail",{today,email,message},{withCredentials:true})
        .catch(err => console.log("error sending message"));
        console.log(response.data);
        setShowInfo(false);
        setShowMessage(false);
    }

    useEffect(() =>{
        getMail();
    },[mail_refreasher])

    const doc_style = {
        color:nightMode ? "white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
        transition:"background-color 0.25s"
    }

    return(
        <div className="main_body">
            <div className="board" style={{...doc_style,width:"600px",height:"400px",}}>
                <p>Mail Box</p>
                    <Date_Search setter={setMails} loader={setLoading} refresher={set_mail_refreasher}/>
                <table>
                    <thead>
                        <tr style={{borderBottom: nightMode ?"2px solid white":" 2px solid hsl(0, 0%, 0%)"}}>
                            <th>Date</th>
                            <th>Sender</th>
                            <th>content</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading? 
                        <tr>
                            <td>
                                <Loading_animation/>
                            </td>
                        </tr>:
                        <>

                        {mails.length == 0? 
                        <>
                        <tr>
                            <td>
                                <No_Data_animation/>
                            </td>
                        </tr>
                        </>:
                        mails.map((raw,idx) =>(
                            <tr key={raw.id} style={{borderBottom: nightMode ?"1px solid white":" 1px solid hsl(0, 0%, 0%)"}} className={nightMode? "night":"day"} onClick={() => {
                                setShowInfo(true);
                                setdata([raw.email,raw.message,raw.name,parseFloat(raw.amount),raw.id,raw.date_time?.slice(0,10)]);
                                }}>
                                <td>{raw.date_time?.slice(0,10)}</td>
                                <td>{raw.name}</td>
                                <td>{raw.message.length > 20? raw.message?.slice(0,20)+"..":raw.message}</td>
                                <td>▶</td>
                            </tr>
                        ))
                        }
                        </>
                        }
                    </tbody>
                </table>
            </div>
            {showInfo?
            <div className="overlayStyle">
                <div className="board" style={{...doc_style,minWidth:"400px",maxWidth:"500px",textAlign:"center"}}>
                    <p>From {data[2]}</p>
                    <br/>
                    <p>{data[1]}</p>
                    <br/>
                    {Number(data[3]) === 0? null:
                    <>
                    <p>${data[3]}</p>
                    <br/>
                    </>}
                    <div className="fcont">
                        <button style={{color:nightMode ? "white":"black",backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",padding:"5px 10px"}}  onClick={() => setShowInfo(false)}>Close</button>
                        <button style={{color:nightMode ? "white":"black",backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",padding:"5px 10px"}}  onClick={() => setShowMessage(true)}>Send Message</button>
                        {Number(data[3]) === 0? null:<button style={{color:nightMode ? "white":"black",backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",padding:"5px 10px"}} onClick={() => Pay(data[0],data[3],data[4],data[5])}>Pay</button>}
                    </div>
                </div>   
            </div>
            :null}
            {showMessage? 
            <div className="overlayStyle">
                <div className="board" style={{...doc_style,minWidth:"400px",maxWidth:"600px",textAlign:"center"}}>
                    <form onSubmit={(e) => SendMail(e)}>
                        <p>write your message here</p>
                        <br/>
                        <textarea name="message"placeholder="Dear Freelancer .eng" required style={{minHeight:"20px",color:nightMode ? "white":"black",backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",padding:"5px 10px",overflow:"hidden",resize:"none"}}
                        onInput={(e) => {e.target.style.height = "auto";e.target.style.height = e.target.scrollHeight + "px";}}/>
                        <br/>
                        <br/>
                        <div className="fcont">
                            <button style={{color:nightMode ? "white":"black",backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",padding:"5px 10px"}} type="button" onClick={() => setShowMessage(false)}>Cancle</button>
                            <button style={{color:nightMode ? "white":"black",backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",padding:"5px 10px"}} type="submet">Send</button>
                        </div>
                    </form>
                </div>
            </div>
            :null}
            {charging? 
            <div className="overlayStyle">
                <div style={{color:nightMode ? "white":"black",backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",padding:"5px 10px"}}>
                    <Loading_animation/>
                </div>
            </div>
            :null}
        </div>
    )
}