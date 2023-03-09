import React, { Component } from "../../rct/rct";

interface IProps {
  children: any; // React.ReactNode;
}

class ErrorBoundary extends Component<IProps> {
  state = { hasError: false };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    return this.state.hasError ? (
      <h2>Error Boundary: Error!</h2>
    ) : (
      this.props.children
    );
  }
}

export default ErrorBoundary;
