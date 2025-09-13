import { Dcount2 } from "./dcont2";
import { Dcount3 } from "./dcount3";
import { createContext } from "react";

export const Nightsetting = createContext({
    nightMode:false,
    setNightMode: () =>{}
})

export function D_Body(){
    

    return(
        <>
        <div className="main_body">
            <Dcount2/>
            <Dcount3/>
        </div>
        </>
    )
}