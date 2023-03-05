import React, { ReactDOM, useState } from "../rct/Rct";

import ChildrenComp from "./ChildrenComp";
import ChildrenClassComponent from "./ChildrenClassComponent";
import ErrorBoundary from "./ErrorBoundary";

const TestReact = () => {
  const elementus = <div>Some DIV element</div>;

  const rerender = () => {
    ReactDOM.render(
      <div>rendered ok</div>,
      document.getElementById("src_to_render")
    );
    const root = ReactDOM.createRoot(
      document.getElementById("src_to_render") as HTMLElement
    );
    root.render(<div>rendered ok</div>);
  };

  return (
    <div
      id="preloader"
      className="preloader"
      style={{
        display: "block",
        height: "300px",
        width: "400px",
        borderRadius: "2.2px",
        margin: "auto",
      }}
    >
      <br />
      <br />
      <br />
      <br />
      <h1 style={{ display: "block", textAlign: "center" }}>Testing...</h1>
      <br />
      <br />
      <div
        style={{
          margin: "auto",
          display: "block",
          height: "5px",
          width: "110px",
          border: "1px solid #aaa",
          borderRadius: "2.2px",
        }}
      >
        <div
          style={{
            display: "block",
            height: "5px",
            width: "100px",
            background: "#aaa",
            borderRadius: "2.2px",
          }}
        ></div>
      </div>
      <br />
      <br />
      {elementus}
      <br />
      <div>
        Included DIV
        <br />
        <br />
        <ChildrenClassComponent text="ChildrenClassComponent" />
        <br />
        <ChildrenComp />
        <ChildrenComp>children text</ChildrenComp>
        {/* {(item: string) => `${item}`} */}
      </div>

      <h2>Error Boundry Test:</h2>
      <ErrorBoundary>ErrorBoundary</ErrorBoundary>
      <ErrorButton />

      <br />
      <div>Last DIV</div>
      <button onClick={rerender} style={{ cursor: "pointer" }}>
        rerender
      </button>
    </div>
  );
};

const ErrorButton = () => {
  const [st, setSt] = useState(false);

  const makeErr = () => setSt(true);

  if (st) {
    throw new Error("I crashed!");
  }

  return (
    <button onClick={makeErr} style={{ cursor: "pointer" }}>
      Make Error
    </button>
  );
};

export default TestReact;

// const elementus = React.createElement('div', null, 'some div element'); // '<script>alert("alllllerrrt")</script>';

// const el = React.createElement('div', { className: 'very first' },
//   '<script>alert("alllllerrrt")</script>',
//   elementus,
//   1,
//   0,
//   undefined,
//   // { undefined }, = нельзя
//   React.createElement('div', { className: 'second' }, 'без тега',
//     <ChildrenClassComponent />,
//   // React.createElement(alert, 'alllllerrrt!!!'),
//     // React.createElement('div', { className: 'third',  }),
//     // 'fragment hi',
//     <ChildrenComp />
//   ),
//   // React.createElement('div', { className: 'fourth', contentEditable: "true" }, 'editable'),
//   null,
//   'another one'
// );

// // el.props.children.push(React.createElement('div', { className: 'ok' }, 'push ChildrenComp'), <ChildrenComp />);

// // React.put(
// //   el,
// //   React.createElement('div', { className: 'ok' }, 'put new el'),
// //   React.createElement('div', { className: 'ok' }, 'put another new el')
// // );

// console.log(el);

// ReactDOM.render(el, document.getElementById('root'));

// // const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// // root.render(el);
