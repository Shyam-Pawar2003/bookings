import React from "react";
import {MixedPropertiesChildComponent} from "./MixedPropertiesChildComponent";

export const MixedPropertiesParentComponent = () => {

    let trainerProfiles = [

        {
            trainerID:1701,
            trainerName:"Yashwanth",
            age:27,
            isMarried:false,
            courses:["HTML","CSS","JavaScript","ReactJavaScript"]
        },

        {
            trainerID:1702,
            trainerName:"Sunil",
            age:35,
            isMarried:true,
            courses:["CoreJava","SQL"]
        },

        {
            trainerID:1703,
            trainerName:"Divya",
            age:32,
            isMarried:true,
            courses:["HTML","CSS","SQL"]
        },

        {
            trainerID:1704,
            trainerName:"Nandhitha",
            age:29,
            isMarried:false,
            courses:["HTML","CSS","JavaScript","ReactJavaScript"]
        }

    ];

    return(
        <MixedPropertiesChildComponent trainerProfiles={trainerProfiles}/>
    )
}