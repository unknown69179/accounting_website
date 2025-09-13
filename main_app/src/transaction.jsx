import { Dcont1 } from "./dcont-1"
import { Adding_t } from "./adding_a_t"
import { createContext , useState ,useContext } from "react"
import { Nightsetting } from "./dashboard"
import { Page } from "./pager"
import axios from "axios"

export const adding_panel = createContext()


export function Transaction(){
    const {set_refresh,set_data_content,set_Disabled,userSelect1} = useContext(Page);

    let data ={}
    
    function proccessing(){

        const a_date = document.getElementById("date").value;
        const a_type = document.getElementById("type").value;
        const a_account = document.getElementById("account").value;
        const a_amount = document.getElementById("amount").value;
        const a_description = document.getElementById("description").value;

        if (a_amount == "" || a_amount == "0"){
            window.alert("please provide a valid amount");
        }
        else {
            
            data = {
                date:a_date,
                type:a_type,
                account:a_account,
                amount:String(a_amount).padStart(2,"0"),
                description:a_description,
                userSelect:userSelect1.toLocaleLowerCase()
            }
            try{
                console.log(userSelect1.toLocaleLowerCase());
                
                axios.post("http://localhost:5000/transactions",data,{withCredentials:true}).then(res => console.log(res.data)).catch(err => console.log("sending error \n",err))
                setshow(false);
                set_refresh(x => !x);
                
            }
            catch (err){
                console.log("error updating",err);
                
            }
            
        }        
    }
    
async function importing() {
  const url = document.getElementById("url").value;
  if (!url) return window.alert("Invalid URL");

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data || !Array.isArray(data)) {
      window.alert("Invalid data format");
      return;
    }

    set_Disabled(true);

    const importedData = data.map(tx => [
      tx.date,
      tx.type,
      tx.account,
      tx.description,
      tx.amount
    ]);

    set_data_content(importedData);

  } catch (err) {
    console.error(err);
    window.alert("There is an error or mismatched data");
  }
}

    const now = new Date()

    const year = now.getFullYear()

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const today = `${year}-${month}-${day}`;    

    const {nightMode} = useContext(Nightsetting);
    const [show_adding_panel , setshow] = useState(false);
    const [date,setDate] = useState(today);

    const panel_style = {
            position:"absolute",
            color:nightMode ? "white":"black",
            backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",
            width:"300px",
            padding:"15px 30px"
    }


    const inputStyle = {
            color:nightMode ? "white":"black",
            borderRadius:"20px",
            backgroundColor:nightMode ? "hsl(209, 100%, 30%)":"hsl(0, 0%, 85%)",
            border:"none",
            padding:"2px 0px",
            textAlign:"center",
            width:"200px",
            fontFamily:" 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            cursor:"pointer"
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
        backgroundColor:nightMode ? "hsl(209, 100%, 30%)":"hsl(0, 0%, 85%)",
        width: "70px",
        height: "30px",
        border:"none",
        padding:"2px 0px",
        borderRadius:"10px",
    }

    return(
        <>
        <adding_panel.Provider value={{show_adding_panel,setshow}}>
        <div className="main_body">
            <Dcont1/>
            {show_adding_panel ? 
            <div className="overlayStyle">
            <div className="board" style={panel_style}>
                <div className="fcont">
                    <p>Date</p>
                    <input id="date" type="date" style={inputStyle} value={date} onChange={(e) => setDate(e.target.value)}/>
                </div>
                <hr/>
                <div className="fcont">
                    <p>Type</p>
                    <select id="type" style={inputStyle}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <hr/>
                <div className="fcont">
                    <p>Account</p>
                    <select id="account" style={inputStyle}>
                        <option value="bank account">Bank Account</option>
                        <option value="sales revenue">Sales Revenue</option>
                    </select>
                </div>
                <hr/>
                <div className="fcont">
                    <p>Amount</p>
                    <input id="amount" type="number" style={inputStyle} min={0}></input>
                </div>
                <hr/>
                <div className="fcont">
                    <p>Description</p>
                    <input id="description" type="text" style={inputStyle} placeholder="e.g Bank Bill's" maxLength={30}></input>
                </div>
                <br/>
                <div style={{
                    display:"flex",
                    justifyContent:"end",
                    columnGap:"20px"
                }}>
                    <button style={delete_button} onClick={() => setshow(false)} >Cancle</button>
                    <button style={add_button} onClick={proccessing}>Add</button>
                </div>
            </div></div>: null}
            <Adding_t/>
        </div>
        </adding_panel.Provider>
        </>
    )
}