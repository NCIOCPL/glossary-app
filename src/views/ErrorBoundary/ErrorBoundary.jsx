import React, { Component } from 'react';

import ErrorPage from './ErrorPage';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the error page.
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return <ErrorPage />;
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
