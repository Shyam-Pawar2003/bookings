import React from "react";
import "./ArrayObjectChildComponent.css";

export default ArrayObjectChildComponent = ({ rainbowColors }) => {
    return (
        <>
            <h1>ArrayObjectProperties : RainbowColors</h1>

            <ul id="rainbow_colors_list">
                {
                    rainbowColors.map((rainbowColor, rainbowIndex) => {
                        return (
                            <li key={rainbowIndex}
                                className="rainbow_colors_list_items">
                                {rainbowIndex + 1} item in single right &gt; {rainbowColor}
                            </li>
                        );
                    })
                }
            </ul>
        </>
    );
}