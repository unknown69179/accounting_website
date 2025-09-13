import { Nightsetting } from "./dashboard"
import { useContext,useState,useEffect } from "react"
import axios from "axios";


export function Dcount2(){

    const now = new Date()

    const year = now.getFullYear()

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const today = `${year}-${month}-${day}`; 

    const [data,setdata] = useState([]);
    const [reports,setReports] = useState([]);
    const [showInfo,setShowInfo] = useState(false); 
    const [showMessage,setShowMessage] = useState(false); 

    const {nightMode} = useContext(Nightsetting);

    async function getReports(){
        const response = await axios.get("http://localhost:5000/getReport",{withCredentials:true}).catch(err => console.log("error getting reports in F.E"));
        setReports(response.data);
    }

    async function SendMail(e) {
        e.preventDefault();
        const message = e.target.message.value;
        const email = data[0];
        const response = await axios.post("http://localhost:5000/sendMail",{today,email,message},{withCredentials:true})
        .catch(err => console.log("error sending message"));
        setShowInfo(false);
        setShowMessage(false);
        console.log(response.data);
    }

    useEffect(()=>{
        getReports();
    },[])

    const cont1_style = {
        color:nightMode? "white":"black",
        transition:"background-color 0.25s",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white"
        
    }
    const cont_style = {
        color:nightMode? "white":"black",
        transition:"background-color 0.25s",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white"
        
    }

    return(
        <>
            <div className="board" style={{...cont1_style,width:"250px",height:"420px"}}>
                <table>
                    <thead>
                        <tr  style={{borderBottom: nightMode ?"2px solid white":" 2px solid hsl(0, 0%, 0%)"}}>
                            <th style={cont_style}>Reasent Report's</th>
                        </tr>
                    </thead>
                    <tbody>
                    {reports.map((raw,idx) =>(
                            <tr key={raw.id} style={{borderBottom: nightMode ?"1px solid white":" 1px solid hsl(0, 0%, 0%)"}} className={nightMode? "night":"day"} onClick={() => {
                                setShowInfo(true);
                                setdata([raw.email,raw.message,raw.name]);
                                }}>
                                <td>{raw.name}</td>
                                <td>▶</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            {showInfo?
            <div className="overlayStyle">
                <div className="board" style={{...cont_style,minWidth:"400px",maxWidth:"500px",textAlign:"center"}}>
                    <p>From {data[2]}</p>
                    <br/>
                    <p>{data[1]}</p>
                    <br/>
                    <div className="fcont">
                        <button style={{color:nightMode ? "white":"black",backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",padding:"5px 10px"}}  onClick={() => setShowInfo(false)}>Close</button>
                        <button style={{color:nightMode ? "white":"black",backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",padding:"5px 10px"}}  onClick={() => setShowMessage(true)}>Send Message</button>
                    </div>
                </div>   
            </div>
            :null}
                        {showMessage? 
            <div className="overlayStyle">
                <div className="board" style={{...cont_style,minWidth:"400px",maxWidth:"600px",textAlign:"center"}}>
                    <form onSubmit={(e) => SendMail(e)}>
                        <p>write your message here</p>
                        <br/>
                        <textarea name="message"placeholder="Dear Client/person .eng" required style={{minHeight:"20px",color:nightMode ? "white":"black",backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",padding:"5px 10px",overflow:"hidden",resize:"none"}}
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
            </>
    )
}