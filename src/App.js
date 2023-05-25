import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import track from 'react-tracking';

import './styles/dictionaries.scss';

import { useAppPaths } from './hooks';
import Definition from './views/Definition';
import PageNotFound from './views/ErrorBoundary/PageNotFound';
import Home from './views/Home';

const App = () => {
	// this should be a DUMB component that just displays our display(group) components
	const {
		HomePath,
		DefinitionPath,
		ExpandPath,
		ExpandPathNoParam,
		ExpandPathSpanish,
		ExpandPathNoParamSpanish,
		SearchPath,
		SearchPathNoParam,
		SearchPathSpanish,
		SearchPathSpanishNoParam,
	} = useAppPaths();

	return (
		<Router>
			<Routes>
				<Route path={HomePath()} element={<Home />} />
				<Route path={DefinitionPath()} element={<Definition />} />
				<Route path={ExpandPath()} element={<Home />} />
				<Route path={ExpandPathNoParam()} element={<Home />} />
				<Route path={ExpandPathSpanish()} element={<Home />} />
				<Route path={ExpandPathNoParamSpanish()} element={<Home />} />
				<Route path={SearchPath()} element={<Home />} />
				<Route path={SearchPathNoParam()} element={<Home />} />
				<Route path={SearchPathSpanish()} element={<Home />} />
				<Route path={SearchPathSpanishNoParam()} element={<Home />} />
				<Route path="/*" element={<PageNotFound />} />
			</Routes>
		</Router>
	);
};

App.propTypes = {
	tracking: PropTypes.object,
};

export default track({
	page: 'app_load',
})(App);
