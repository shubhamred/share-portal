import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  // componentDidCatch(error, errorInfo) {
  //   // You can also log the error to an error reporting service
  //   // logErrorToMyService(error, errorInfo);
  //   console.log('ErrorBoundry', error, errorInfo);
  // }

  render = () => (
    <>
      {(this.state.hasError) ? `<h1>Something went wrong.</h1>` : null}
      {
        this.props.children
      }
    </>
  )
}

export default ErrorBoundary;
