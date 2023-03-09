import React, { Component } from "../rct/rct";

interface IChldrnCl {
  text: string;
}
class ChildrenClassComponent extends Component<IChldrnCl> {
  state = { done: false };

  onBtnClick = () => {
    this.setState({ done: !this.state.done });
  };

  render() {
    return (
      <div
        style={{
          background: "yellow",
          padding: "10px",
          marginTop: "10px",
          color: "green",
          borderRadius: "4px",
        }}
      >
        <div>
          <b>Class Component</b>
        </div>
        <div>{this.props.text}</div>
        Class setState fn test: onClick: false | true btn text:
        <button
          onClick={this.onBtnClick}
          style={{ marginLeft: "5px", cursor: "pointer" }}
        >
          {this.state.done.toString()}
        </button>
      </div>
    );
  }
}

export default ChildrenClassComponent;
