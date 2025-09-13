import React from 'react';
// eslint-disable-next-line import/named
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import HiPage from '../page/hi';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<HiPage />} path="/" />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
