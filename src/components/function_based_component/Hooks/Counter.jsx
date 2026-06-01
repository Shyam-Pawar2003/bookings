import React from "react";
import "./Counter.css";

export const Counter = () => {
  let [count, setCount] = React.useState(0);

  let incrementCount = () => {
    if (count < 15) {
      setCount(++count);
    }
  };

  let resetCount = () => {
    setCount(0);
  };

  let decrementCount = () => {
    if (count > 0) {
      setCount(--count);
    }
  };

  return (
    <>
      <h1 id="count">Count : {count}</h1>

      <button
        id="increment_count_button"
        className="counter_buttons"
        onClick={incrementCount}
      >
        Increment
      </button>

      <button
        id="reset_count_button"
        className="counter_buttons"
        onClick={resetCount}
      >
        Reset
      </button>

      <button
        id="decrement_count_button"
        className="counter_buttons"
        onClick={decrementCount}
      >
        Decrement
      </button>
    </>
  );
};