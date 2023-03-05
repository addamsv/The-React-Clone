import React, { Component } from "../rct/Rct";

class ChildrenClassComponent extends Component {
  state = { done: false };

  onBtnClick = () => {
    this.setState({ done: !this.state.done });
  };

  render() {
    return (
      <div>
        <div>{this.props.text}</div>
        (ChildrenClassComponent) false then true state:
        <button onClick={this.onBtnClick} style={{ cursor: "pointer" }}>
          {this.state.done.toString()}
        </button>
      </div>
    );
  }
}

export default ChildrenClassComponent;
