import { createContext,useState } from "react";

export const Page = createContext();

export function Pager({children}){

    const x = localStorage.getItem("userSelect");
    const [userSelect1 , setuserSelect1] = useState(x);

    const type = userSelect1 == "client"? "D_Body2":"D_Body"; 

    const [page , setpage] = useState(type);
    const [data_content , set_data_content] = useState([])
    const [invoice_content , set_invoce_content] = useState([])
    const [refresh,set_refresh] = useState(false)
    const [refresh2,set_refresh2] = useState(false)
    const [loading,set_loading] = useState(false)
    const [isDisabled,set_Disabled] = useState(false)
    const [search_type , setType] = useState("date");
    const [isloged,setloged] = useState(false);
    const [logPage,setLogPage] = useState(null);
    const [balance,setBalance] = useState(0.00);

    return(
        <>
        <Page.Provider value={{userSelect1 , setuserSelect1,balance,setBalance,logPage,setLogPage,page , setpage , data_content , set_data_content
            ,refresh,isDisabled,set_Disabled,set_refresh,loading,set_loading,
            search_type , setType,invoice_content , set_invoce_content,
            refresh2,set_refresh2,isloged,setloged}}>
            {children}
        </Page.Provider>
        </>
    )
}