import React from "react";
import "./NameUpdaterComponent.css";

export class NameUpdaterComponent extends React.Component {
  constructor() {
    super();
    this.state = { name: "Kalam" };
  }

  updateName = () => {
    this.setState({ name: "KrunalYadav" });
  };

  render() {
    return (
      <>
        <h1 id="name">{this.state.name}</h1>

        <button
          id="update_name_button"
          onClick={this.updateName}
        >
          Update
        </button>
      </>
    );
  }
}