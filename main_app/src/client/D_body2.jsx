import { useState,useContext,useEffect } from "react";
import { Account_balance } from "../account_balance";
import { Nightsetting } from "../dashboard";
import { No_Data_animation } from "../serchStyle";
import axios from "axios";

export function D_Body2(){

    const now = new Date()

    const year = now.getFullYear()

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const today = `${year}-${month}-${day}`; 

    const {nightMode} = useContext(Nightsetting);
    const [freelancers,setFresslancers] = useState([]);
    const [Mails,setMails] = useState([]);
    const [data,setdata] = useState([]);
    const [show,setShow] = useState(false);
    const [showInfo,setShowInfo] = useState(false);
    const [showMessage,setShowMessage] = useState(false);
    const [email,setEmail] = useState("");

    const reasent_mail_style = {
        transition:"background-color 0.25s",
        color:nightMode ? "white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
    }

    const tcolor = {
        color:nightMode ? "white":"black",
        backgroundColor: nightMode ? "hsl(209, 100%, 10%)" : "white",
        transition:"background-color 0.25s"
    }

    async function getMail(){
        const response = await axios.get("http://localhost:5000/getMail",{withCredentials:true}).catch(err => console.log("error getting mail in F.E"));
        setMails(response.data);
    }

    async function get_freelancers_and_mailbox() {
        const response = await axios.get("http://localhost:5000/getFreelancer",{withCredentials:true});
        setFresslancers(response.data);
    }

    async function sendRequest(e,email){
        const amount = e.target.amount.value;
        const request = e.target.request.value;
        console.log(email,request,amount);

        const response = await axios.post("http://localhost:5000/request",{today,email,request,amount},{withCredentials:true})
        .catch(err => console.log("error sending request",err));
        console.log(response.data);
        setShow(false)   
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

    useEffect(()=>{
        get_freelancers_and_mailbox();
        getMail();
    },[])

    return(
    <div className="main_body">
        <div style={{display:"flex",flexDirection:"column"}}>
            <div className="board" style={{...reasent_mail_style,width:"220px",height:"300px",textAlign:"center"}}>
                <table>
                    <thead>
                        <tr style={{borderBottom: nightMode ?"2px solid white":" 2px solid hsl(0, 0%, 0%)"}}>
                            <th>Reasent Mail's</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Mails.map((raw,idx)=>(
                    <tr key={raw.id} style={{borderBottom: nightMode ?"1px solid white":" 1px solid hsl(0, 0%, 0%)"}} className={nightMode? "night":"day"} onClick={() => {
                                setShowInfo(true);
                                setdata([raw.email,raw.message,raw.name,parseFloat(raw.amount)])}}>
                        <td>{raw.name}</td>
                        <td>▶</td>
                    </tr>
                ))}    
                    </tbody>
                </table>
            </div>
            <Account_balance/>
        </div>
        <div className="board" style={{...reasent_mail_style,width:"600px",height:"450px",textAlign:"center"}}>
            <p>FreeLancer's</p>
            <table>
                <thead>
                    <tr style={{borderBottom: nightMode ?"2px solid white":" 2px solid hsl(0, 0%, 0%)"}}>
                        <th>FreeLancer</th>
                        <th>Job Type</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                {freelancers.length == 0? 
                <tr>
                    <td>
                        <No_Data_animation/>
                    </td>
                </tr>:freelancers.map((raw,idx)=>(
                    <tr key={raw.id} style={{borderBottom: nightMode ?"1px solid white":" 1px solid hsl(0, 0%, 0%)"}}>
                        <td style={tcolor}>{raw.user_name}</td>
                        <td style={tcolor}>{raw.jobType}</td>
                        <td style={{...tcolor,width:"200px"}}>{raw.jobDescription}</td>
                        <td><button style={{color:nightMode ? "white":"black",backgroundColor: nightMode ? "hsl(209, 100%, 20%)" : "hsl(0, 0%, 90%)",}}
                        onClick={() => {setEmail(raw.email); setShow(true)}}>Send a Request</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        {show? <div className="overlayStyle">
            <div className="board" style={{...reasent_mail_style,width:"300px",height:"400px"}}>
                <form className="submitted" onSubmit={(e) => {e.preventDefault(); sendRequest(e,email)}}>
                    <p>Write Your Request Down Here</p>
                    <input name="request" style={{...tcolor,height:"100px"}} type="text" required minLength={50}/>
                    <p>Send The Amount That You Are Willing To Give Here</p>
                    <input name="amount" style={tcolor} type="number" step={0.01} required/>
                    <br/>
                    <br/>
                <div className="fcont">
                    <button style={{color:nightMode ? "white":"black",backgroundColor: nightMode ? "hsl(209, 100%, 20%)" : "hsl(0, 0%, 90%)"}} type="button" onClick={() => setShow(false)}>cancle</button>
                    <button style={{color:nightMode ? "white":"black",backgroundColor: nightMode ? "hsl(209, 100%, 20%)" : "hsl(0, 0%, 90%)"}} type="submit">send</button>
                </div>
                </form>
            </div>
        </div>:null}
         {showInfo?
            <div className="overlayStyle">
                <div className="board" style={{...tcolor,minWidth:"400px",maxWidth:"500px",textAlign:"center"}}>
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
                        {Number(data[3]) === 0? null:<button style={{color:nightMode ? "white":"black",backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",padding:"5px 10px"}} >Pay</button>}
                    </div>
                </div>   
            </div>
            :null}
          {showMessage? 
            <div className="overlayStyle">
                <div className="board" style={{...tcolor,minWidth:"400px",maxWidth:"600px",textAlign:"center"}}>
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
    </div>
    )
}