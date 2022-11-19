import React, { Component } from '../core/rct/Rct';
// import React, { Component } from 'react';

class ErrorBoundary extends Component{
  state = { hasError: false };

  // componentDidCatch() {
  //   this.setState({ hasError: true });
  // }

  render() {
    return this.state.hasError ? <h2>Error Boundary: Error!</h2> : this.props.children;
  }
}

export default ErrorBoundary;
