import { useState } from "react";
import { Nightsetting } from "./dashboard";

export function Linker({children}){
    const [nightMode,setNightMode] = useState(false);
    
    return(
        <>
            <Nightsetting.Provider value={{nightMode,setNightMode}}>
                {children}
            </Nightsetting.Provider>
        </>

    )
}