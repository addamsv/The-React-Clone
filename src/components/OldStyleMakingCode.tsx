import React from "../rct/rct";

const elementus = React.createElement("div", null, "some div element"); // '<script>alert("alllllerrrt")</script>';

const OldStyleMakingCode = React.createElement(
  "div",
  {
    className: "very first",
    style: {
      background: "black",
      marginTop: "10px",
      padding: "10px",
      borderRadius: "4px",
    },
  },

  React.createElement(
    "h1",
    { style: { color: "white" } },
    "Old Style Code Component Test"
  ),

  '<script>alert("alllllerrrt")</script>',

  elementus,

  1,

  0,

  undefined,

  // { undefined }, = объект нельзя

  React.createElement(
    "div",
    { className: "second" },
    "без тега",
    React.createElement(alert, "alllllerrrt!!!"),
    React.createElement("div", { className: "third" }),
    "fragment hi"
  ),

  React.createElement(
    "div",
    { className: "fourth", contentEditable: "true" },
    "editable"
  ),
  null,
  "another one"
);

/* 
OldStyleMakingCode?.props.children.push(
  React.createElement("div", { className: "ok" }, "push ChildrenComp")
);

React.put(
  OldStyleMakingCode,
  React.createElement('div', { className: 'ok' }, 'put new el'),
  React.createElement('div', { className: 'ok' }, 'put another new el')
);
 */

export { OldStyleMakingCode };
