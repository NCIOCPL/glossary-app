import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ErrorPage from './ErrorPage';
import PageNotFound from './PageNotFound';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			hasError: false,
		};
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the error page.
		return {
			error,
			hasError: true,
		};
	}

	render() {
		const { error, hasError } = this.state;
		if (hasError) {
			// Display 404 page only when current route matches a definition route
			// and a 404 response is returned from the api
			const showPageNotFound =
				window.location.pathname.includes('/def') && error.includes('404');

			return showPageNotFound ? <PageNotFound /> : <ErrorPage />;
		}
		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node,
};

export default ErrorBoundary;
