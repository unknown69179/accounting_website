import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useContext,useEffect,useState } from "react";
import axios from "axios"
import { Page } from "./pager";
import { Login } from "./login";
import { Account_balance } from "./account_balance";
import { Nightsetting } from "./dashboard";

export function Profile(){

    const stripe = useStripe();
    const elements = useElements();
    const {setloged,setLogPage,setBalance,userSelect1 , setuserSelect1} = useContext(Page);
    const {nightMode} = useContext(Nightsetting)
    const [deleter,setDeleter] = useState("");
    const [Ptext,setPtext] = useState("");
    const [Ptext2,setPtext2] = useState("");
    const [cardMessage,setCardMessage] = useState("");
    const [jobtype,setJobType] = useState("")
    const [description,setDescription] = useState("")
    const [show,setShow] = useState(false);
    const [sure,setSure] = useState(false);
    const [ChangeShow,setChangeShow] = useState(false);
    const [ready,setready] = useState(false);
    const [jobChoose,setjobChoose] = useState(false);
    const [discriptionAdding,setdiscriptionAdding] = useState(false);
    const [userSelect, setuserSelect] = useState(localStorage.getItem("userSelect") || "client");


    function logingout(){
        axios.post("http://localhost:5000/logout",null,{withCredentials:true});
        setloged(false)
        setLogPage(<Login/>)
    }

    async function data() {
        const resulte = await axios.get("http://localhost:5000/profile",{withCredentials:true})
        setDeleter(resulte.data[0].id);
        setPtext(`${resulte.data[0].user_name}`);
        console.log(resulte.data[0].email);
        setBalance(resulte.data[0].balance);
    }

    async function Delete() {
        console.log(deleter);
        try{
            const res = await axios.delete("http://localhost:5000/profile",{data:{id:deleter},withCredentials:true})
            
            logingout();
        }
        catch(err){
            console.error("Error deleting account in front end", err);
        }

    }

    async function Checker(){
        const password = document.getElementById("checker").value;        
        try {
            const res = await axios.post("http://localhost:5000/Dchecker",{password:password},{withCredentials:true})
            if(res.data.success){
                Delete();
                setSure(false);
                setShow(false);
            }
        } catch (err) {
            console.log("error in post",err);
            setPtext2("Wrong Password")
        }


    }

    async function saveCard(e){
        e.preventDefault();
        setCardMessage("")

        const name = e.target.elements[0].value;
        
        if (!stripe || !elements) {
        
            setCardMessage("Stripe is not ready")
            return;
        }; 
        
        const card = elements.getElement(CardElement);
        if (!card) {
            console.error("Card element not mounted yet!");
            return;
        }
        try
        {        
            
            const {data} = await axios.post("http://localhost:5000/cardSaver",null,{withCredentials:true});
            if (!data.clientSecret) {
                setCardMessage("No client secret from server");
                return;
            }
            const resulte = await stripe.confirmCardSetup(data.clientSecret,{
                payment_method:{card:card,billing_details:{name}},})
                if(resulte.error){
                    setCardMessage(resulte.error.message|| "Error confirming card setup");
                    console.log(resulte.error.message);
                    return;
                }
                else{

                      const pm = resulte.setupIntent?.payment_method;
                if (!pm) {
                setCardMessage("No payment method returned from Stripe");
                console.log("setupIntent:", resulte.setupIntent);
                return;
                }
                
                await axios.post(
                "http://localhost:5000/savePaymentMethod",
                { payment_method: pm },
                { withCredentials: true }
                );

                setCardMessage("");
                localStorage.setItem("card_name",name);
                setChangeShow(false);
                setready(false);
            }
    }
    catch(err){
        console.log(err.message);

        setCardMessage("error")
    }
}

    async function jobSetter(e) {
        const job = e.target.innerText;
        try {
            await axios.put("http://localhost:5000/jobType",{job},{withCredentials:true})
            setJobType(job)
        } catch (error) {
            console.log("error sending jobtype");
        }
    }
    function handleOutsideClick(event) {
    if (event.target.id !== "jobTypeSelector") {
        setjobChoose(false);
        document.removeEventListener("click", handleOutsideClick);
    }
    }
    
    async function getJobType(){
        const response = await axios.get("http://localhost:5000/jobType",{withCredentials:true}).catch(err => console.log("error getting jobType"));
        setJobType(response.data[0].jobType);
    }

    async function sendDescription(e) {
        e.preventDefault();
        const desc = e.target.desc.value;
        await axios.put("http://localhost:5000/description",{desc},{withCredentials:true});
        setdiscriptionAdding(false);
        setDescription(desc);
    }

    async function getDescription() {
        const response = await axios.get("http://localhost:5000/description",{withCredentials:true});
        setDescription(response.data[0].jobDescription);
    }


    useEffect(() =>{
        getDescription();
        getJobType();
        data();
    },[])

        const input_style ={
            color:nightMode ? "white":"black",
            backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)"
        }

        const Dcont1_style = {
        width:"60%",
        height:"550px",
        color:nightMode ? "white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
        transition:"background-color 0.25s",
        textAlign:"center",
        marginBottom:"40px"
    }
        const sure_style = {
        width:"20%",
        height:"100px",
        color:nightMode ? "white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
        transition:"background-color 0.25s",
        textAlign:"center"
    }
        const deleter_style = {
        width:"20%",
        height:"200px",
        color:nightMode ? "white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
        transition:"background-color 0.25s",
        textAlign:"center"
    }
    const profile_style = {
        width:"100px",
        height:"100px",
        borderRadius:"100%",
        backgroundColor:"grey"
    }

    const button_style ={
        borderRadius:"15px",
        backgroundColor:nightMode ? "hsl(209, 100%, 30%)":"hsl(0, 0%, 85%)",
        color:nightMode? "white":"black",
        padding:"5px 10px"
    }
    return( 
        <div className="main_body">
            <div className="board" style={Dcont1_style}>
            <div style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
                <div style={profile_style}></div>
                <p>{Ptext}</p>
                <div style={{display:"flex", justifyContent:"space-around" ,height:"30px",columnGap:"15px"}}>
                    <button style={button_style} onClick={() => setShow(true)}>delete</button>
                    <button style={button_style} onClick={logingout}>logout</button>
                </div>
            </div>
            {userSelect == "client"? null:
            <>
                        <p style={{justifySelf:"start", cursor:"pointer"}} onClick={() =>{
                setjobChoose(true);
                document.addEventListener("click",event =>{
                    if (event.clicked == 0){
                        setjobChoose(false);}})
            }}>{jobtype == "" ? "choose your job type": `Job : ${jobtype}`}</p>
            {jobChoose?
            <div style={{position:"fixed",backgroundColor: nightMode? "hsl(209, 100%, 30%)":"white",borderRadius:"15px",width:"100px"}}>
                <p onClick={(e) => {
                    jobSetter(e);
                    handleOutsideClick(e);
                    }}>Designer</p>
                    
                <p onClick={(e) => {
                    handleOutsideClick(e);
                    jobSetter(e);
                    }}>Devaloper</p>
            </div>
            : null}
                    <p style={{justifySelf:"baseline",marginLeft:"130px"}}>Your Description</p>
                <div className="fcont" style={{alignItems:"center"}}>{discriptionAdding?
                        <form onSubmit={(e) => sendDescription(e)}>
                            <input name="desc" style={{...input_style,width:"400px",height:"200px",direction:"ltr",textAlign:"left"}} minLength={120} maxLength={150} placeholder="whrite your description here"/>

                            <button style={button_style} type="submit">Submit Your Description</button>
                        </form>
                        :
                    <>
                        <p style={{textAlign:"left",width:"400px"}}>{description == ""? "please provide a valid description for your job":description}</p>
                        <button style={{...button_style,height:"30px"}} onClick={() => setdiscriptionAdding(true)}>{description == ""? "Add Description":"Change Your Description"}</button>
                    </>}
                    
                </div>
            </>
            }
                <div className="fcont" style={{alignItems:"center"}}>
                    <Account_balance/>
                    <div style={{display:"flex",flexDirection:"column"}}>
                        <button onClick={() =>setChangeShow(true)} style={{...button_style}}>Change Account</button>
                    </div>
                </div>
                <select
                style={{ ...input_style, borderRadius: "15px", height: "30px" }}
                value={userSelect}
                onChange={(e) => {
                    setuserSelect(e.target.value);
                    localStorage.setItem("userSelect", e.target.value);
                    setuserSelect1(e.target.value);
                }}
                >
                <option value="client">Client</option>
                <option value="FreeLancer">FreeLancer</option>
                </select>

            </div>
            {show? <div className="overlayStyle">
                        {sure? 
                                        <div className="board" style={deleter_style}>
                                                <p>Please Confirm The Password</p>
                                                <input type="text" style={input_style} pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$" id="checker"/>
                                                <br/>
                                                <br/>
                                                <div style={{display:"flex",justifyContent:"space-around",width:"100%"}}>
                                                    <button onClick={() => {setShow(false)
                                                        setSure(false);
                                                    }} style={button_style}>No</button>
                                                    <button onClick={() =>{
                                                        Checker();

                                                    }} style={button_style}>Yes</button>
                                                </div>    
                                                    <p>{Ptext2}</p>
                                        </div>:  
                                        <div className="board" style={sure_style}>
                                            <div>
                                                <p>Are You Sure?</p>
                                                <br/>
                                                <div style={{display:"flex",justifyContent:"space-around"}}>
                                                    <button onClick={() => setShow(false)} style={button_style}>No</button>
                                                    <button onClick={() => setSure(true)} style={button_style}>Yes</button>
                                                </div>
                                            </div>
                                        </div>
                }   
                
                    </div>:null}
                    {ChangeShow? 
                    <div className="overlayStyle">
                        <div className="board" style={deleter_style}>
                            <form onSubmit={saveCard}>
                                <p style={{marginBottom:"10px"}}>Please Enter Card Credit Number And Account Name</p>
                                <input type="text" required min={3} style={{...input_style,marginBottom:"10px"}} placeholder="Account Name"/>
                                <CardElement onReady={() => setready(true)} />
                                <p style={{color:"red"}}>{cardMessage}</p>
                                <div className="fcont" style={{marginTop:"10px"}}>
                                    <button style={button_style} type="button" onClick={()=>setChangeShow(false)}>Cancle</button>
                                    <button style={button_style} type="submit" disabled={!stripe || !elements || !ready}>submit</button>
                                </div>
                            </form>
                                
                        </div>
                    </div>
                    :null}
        </div>
    )
}