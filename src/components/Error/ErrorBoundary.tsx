import React, { Component } from "../../rct/rct";

interface IProps {
  children: any; // React.ReactNode;
}

class ErrorBoundary extends Component<IProps> {
  state = { hasError: false };

  componentDidCatch() {
    console.log("catched");

    this.setState({ hasError: true });
  }

  render() {
    // console.log(this.props.children);

    return this.state.hasError ? (
      <h2>Error Boundary: Error!</h2>
    ) : (
      this.props.children
    );
  }
}

export default ErrorBoundary;
