import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "./navbar"
import { useContext ,useEffect} from "react"
import { D_Body } from "./dashboard"
import { D_Body2 } from "./client/D_body2";
import { Transaction } from "./transaction"
import { Invoice } from "./Invoice"
import { Page } from "./pager"
import { Bills } from "./bills"
import { Reports } from "./report's"
import { Login } from "./login"
import { Profile } from "./profile"
import Setting from "./setting1"
import { Mailbox } from "./client/mailbox";
import axios from "axios"

const key = loadStripe("pk_test_51S55aJ23ZNtdOaOPkGVTeCUyqNE8lIwPQ81MEnMFw4C3vJ2RdqKrc84w2PYnc1Tm2PT5r3p260oUKG4Ek4rmsqHn00dyUhEFIQ");

function App() {
    const {page,isloged,setloged,logPage,setLogPage} = useContext(Page);
    let The_page = ""

    if (page == "D_Body"){
        The_page = <D_Body/>
    }
    else if (page == "Transaction"){
        The_page = <Transaction/>   
    }
    else if (page == "Invoice"){
        The_page = <Invoice/>
    }
    else if (page == "Bills"){
        The_page = <Bills/>
    }
    else if (page == "Report's"){
        The_page = <Reports/>
    }
    else if (page == "profile"){
        The_page = <Profile/>
    }
    else if (page == "D_Body2"){
        The_page = <D_Body2/>
    }
    else if (page == "mailbox"){
        The_page = <Mailbox/>
    }

    async function checker() {
        const response =await axios.get("http://localhost:5000/check_login", { withCredentials: true })
        if (response.data.logged == false){
            setLogPage(<Login/>)
        }
        else{
            setloged(response.data.logged);
            The_page = <D_Body/>
        }
        }

    useEffect(() => {
        checker();
  }, [setloged]);
    
    return(<>
    <Elements stripe={key}>        
        {isloged? 
        <>
    <Navbar/>
    <Setting/>
    {The_page}</>
        :<>
        {logPage}
        </>
}
    </Elements>
   </> )
}

export default App