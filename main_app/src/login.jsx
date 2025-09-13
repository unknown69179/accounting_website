import { useState,useEffect,useContext } from "react"
import { Page } from "./pager";
import axios from "axios";

export function Login(){
  const {setloged, setuserSelect1} = useContext(Page);
  const nightMode =localStorage.getItem("nightmode"); 
  const [userSelect, setuserSelect] = useState(localStorage.getItem("userSelect"));

async function proccessing_create(data) {
  try {
    const res = await axios.post("http://localhost:5000/signup", data,{withCredentials:true})

    if (res.data.success) {
      setloged(true); 
    } else {

      document.getElementById("errorMessage").textContent = res.data.message;
    }
  } catch (err) {
    if (err.response) {
      document.getElementById("errorMessage").textContent = err.response.data.message;
    } else {
      console.log("Network or server error:", err);
    }
  }
}

async function proccessing_login(data) {

  const email = data.email;
  const password = data.password;
try{ 
    const res = await axios.post("http://localhost:5000/login2", { email, password },{withCredentials:true})
    if (res.data.message === "") {
      setloged(true);}
  }
  catch(err){
    if (err.response){
      document.getElementById("errorMessage").textContent = err.response.data.message;
    }
    else {
      console.log("Network or server error:",err);
    }
    
  }

}
  const [cl,setcl] = useState(false);

  useEffect(()=>{
  if(nightMode){
    document.body.style.backgroundColor = "hsl(209, 100%, 13%)";
  }
  else{
    document.body.style.backgroundColor = "white";
  }
  },[])
  
  useEffect(()=>{
     document.getElementById("errorMessage").textContent = "";
  },[cl])

  const input_style = {
    color:nightMode? "white" : "black",
    backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"white"  
  }
  const cont_style = {
    color:nightMode? "white" : "black",
    boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 30px grey",
    backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white"  
  }

  const selector = <>
                  <select
                  style={{ ...input_style, borderRadius: "15px", height: "30px" }}
                  value={userSelect}
                  onChange={(e) => {
                    setuserSelect(e.target.value);
                    localStorage.setItem("userSelect", e.target.value);
                    setuserSelect1(e.target.value)
                  }}
                >
                      <option value="client">Client</option>
                      <option value="FreeLancer">FreeLancer</option>
                </select>
                <br/>
                </>



  return(
    <div style={cont_style} className="board" id="loginStyle" >
      <img src="src/assets/logo.png" id="logo2"/>
      <p id="errorMessage"></p>
{cl?
<>
        <form onSubmit={(e) => {
          e.preventDefault();

          if (e.target.password2.value == e.target.password3.value){
           const data = {
              name: e.target.name.value,
              birth_date: e.target.birthDate.value,
              email:e.target.email2.value,
              password:e.target.password2.value
            }
            proccessing_create(data);
          }
          else {
            window.alert("mismatchig passwords!")
          }
        }}>
          <div className="fcont">
          <p>name</p>
          <input style={input_style} type="text" name="name" required/>
          </div>
          <div className="fcont">     
          <p>birth date</p>
          <input style={input_style} type="date" name="birthDate" required/>
          </div>
          <div className="fcont">
          <p>email</p>
          <input style={input_style} type="email" name="email2" required/>
          </div>
          <div className="fcont">
          <p>password</p>
          <input style={input_style} type="password" minLength={8} maxLength={15} pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$" title="minimum required length is 8 Must contain at least one char" name="password2" required/>
          </div>
          <div className="fcont">
          <p>confirm password</p>
          <input style={input_style} type="password" minLength={8} maxLength={15} pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$" title="minimum required length is 8 Must contain at least one char" name="password3" required/>
          </div>
          {selector}
          <br/>
          <button style={input_style} className="submiter" type="submit">create</button>
        </form>
        <p className="pp" onClick={() => setcl(false)}>login</p>
</>:
<>      <form onSubmit={(e) =>{
        e.preventDefault();
        const data = {
          email:e.target.email.value,
          password:e.target.password.value
        }

        proccessing_login(data);

        }}>
          <div className="fcont">
          <p>email</p>
          <input style={input_style} type="email" name="email" required/>
          </div>
          <div className="fcont">
          <p>password</p>
          <input style={input_style} type="password" minLength={8} name="password" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$" title="Must contain at least one" required/>
          </div>
          {selector}
      <br/>
      <button style={input_style} className="submiter" type="submit">login</button>
      </form>
      <p className="pp" onClick={() => {setcl(true)}}>create an account</p>
      </>}
    </div>
  )
}