import React from "react";
import "./ThemeChangerComponent.css";

export class ThemeChangerComponent extends React.Component {
  constructor() {
    super();
    this.state = { toggleStatus: false };
  }

  toggleTheme = () => {
    this.setState({
      toggleStatus: !this.state.toggleStatus,
    });
  };

  render() {
    return (
      <div>
        <button
          id="theme_toggle_button"
          onClick={this.toggleTheme}
        >
          {this.state.toggleStatus ? "ON" : "OFF"}
        </button>
      </div>
    );
  }
}