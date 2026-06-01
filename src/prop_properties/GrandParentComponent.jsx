import React from "react";
import {Pare}
export const GrandParentComponent=()=>{
    let address=[721,"WestAnuppanad"];
    return(
        <GrandParentComponent name={"Shoam"} age={28} isMarried={true} hasChildren={true}>
            {address}
        </GrandParentComponent>
    )
}