import { Nightsetting } from "./dashboard";
import { useContext } from "react";

 
export function Date_Search({loader,setter,refresher}){
    const now = new Date()

    const year = now.getFullYear()

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const today = `${year}-${month}-${day}`; 

    const {nightMode} = useContext(Nightsetting);

    async function searching(e) {
        loader(true)
        refresher(x => !x);
        const date = e.target.date;
        setTimeout(() =>{
            loader(false);
            setter(items => items.filter(item => String(item.date_time).slice(0,10) <= String(date.value)));
        },1000)
        
    }


    return(
            <form onSubmit={(e) => {e.preventDefault();searching(e)}} className="fcont" style={{height:"30px"}}>
                <input name="date" defaultValue={today} type="date" style={{height:"20px",color:nightMode ? "white":"black",backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",padding:"5px 10px"}}/>
                <button type="submit" onClick={() => loader(true)} style={{color:nightMode ? "white":"black",backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",padding:"5px 10px"}}>Search</button>
            </form>
    )

}