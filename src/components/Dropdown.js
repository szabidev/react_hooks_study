import React from "react";
import { useState, useEffect, useRef } from "react/cjs/react.development";

const Dropdown = ({ label, options, selected, onSelectedChange }) => {
  // open state to handle the dropdown open/close function
  const [open, setOpen] = useState(false);
  // using useRef hook - assigning ref to one of the elements that the component returns
  // useRef hook gives a direct reference to a DOM element
  const ref = useRef();

  // We have to set up an event listener on the body from the Dropdown, Components can only listen for events on the elements they created
  // to resolve this issue , we have to set up manual event listeners(simple JS event listeners) and use {capture:true}
  // We will use the useEffect hook that will listen to events on the body when the component first renders
  // When we remove the element the ref.current gets the value null

  // MANUAL JS EVENT LISTENERS ARE CALLED BEFORE REACT EVENT LISTENERS AND IT'S ALWAYS FROM THE MOST CHILD ELEMENT TO THE MOST PARENT ELEMENT
  // SO IT'S LIKE REVERSE EVENT BUBBLING - BODY -> DROPDOWN ITEM -> DROPDOWN  3 - 1 - 2
  useEffect(() => {
    const onBodyClick = (event) => {
      // console.log("Body Click");
      // console.log(event.target);

      // if the element we clicked on is inside ref.current - meaning ui form div then return and don't do anything
      if (ref.current.contains(event.target)) {
        return;
      }
      // otherwise update open state
      setOpen(false);
    };

    document.body.addEventListener("click", onBodyClick, { capture: true });
    // on first render we set up the event listener then whenever the dropdown is removed from the DOM the cleanup function will be called and removes the event

    // useEffect cleanup function
    return () => {
      // remove the event listener from the body element
      document.body.removeEventListener("click", onBodyClick);
    };
  }, []);

  // Mapping through the options prop from the App component to make a list of options which is then rendered
  const renderedOptions = options.map((option) => {
    // filtering option, if a option is selected and shows on the selected.label div dont show it again on the options list / toggle
    if (option.value === selected.value) {
      // null means don't render in react, don't show the item
      return null;
    }
    return (
      <div
        // update the state of selected when clicking on an elemenet,from options object
        onClick={() => {
          // console.log("Item Clicked");
          onSelectedChange(option);
        }}
        key={option.value}
        className="item"
      >
        {option.label}
      </div>
    );
  });

  const styles = {
    marginTop: "80px",
    marginLeft: "30px",
  };

  // console.log(ref.current);

  return (
    // assing useRef hook to the element i need
    <div ref={ref} className="ui form">
      <div className="field">
        <label className="label">{label}</label>
        <div
          onClick={() => {
            // console.log("Dropdown Clicked");
            setOpen(!open);
          }}
          // if open is true add visible and active as className if false no className
          className={`ui selection dropdown ${open ? "visible active" : ""}`}
        >
          <i className="dropdown icon"></i>
          {/* after rerender show the label of the selected item */}
          <div className="text">{selected.label}</div>
          <div className={`menu ${open ? "visible transition" : ""}`}>
            {renderedOptions}
          </div>
        </div>
        {/* <div style={styles}>
          The color is{" "}
          <span style={{ color: selected.value }}>{selected.value}</span>
        </div> */}
      </div>
    </div>
  );
};

export default Dropdown;
