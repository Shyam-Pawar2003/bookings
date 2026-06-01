import React from "react";
import ArrayObjectChildComponent from "./ArrayObjectChildComponent";

export default ArrayObjectParentComponent = () => {
    let rainbowColors = ['violet', 'indigo', 'blue', 'green', 'yellow', 'orange', 'red'];

    return (
        <ArrayObjectChildComponent rainbowColors={rainbowColors} />
    );
}