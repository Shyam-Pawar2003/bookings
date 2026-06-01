import React, { useState } from "react";
import "./Theme.css";

function ThemeChanger() {
  export const [toggleStatus, setToggleStatus] = useState(false);

  const toggleTheme = () => {
    setToggleStatus(!toggleStatus);
  };

  return (
    <div>
      <button
        id="theme_toggle_button"
        onClick={toggleTheme}
      >
        {toggleStatus ? "ON" : "OFF"}
      </button>
    </div>
  );
}

