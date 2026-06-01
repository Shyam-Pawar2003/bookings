import React, { useState } from "react";
import "./Updater.css";

function NameUpdater() {
  const [name, setName] = useState("Kalam");

  const updateName = () => {
    setName("KrunalYadav");
  };

  return (
    <>
      <h1 id="name">{name}</h1>

      <button
        id="update_name_button"
        onClick={updateName}
      >
        Update
      </button>
    </>
  );
}

export default NameUpdater;