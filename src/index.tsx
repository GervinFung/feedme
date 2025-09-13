import { Defined } from '@poolofdeath20/util';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './app';

const root = Defined.parse(document.getElementById('root')).orThrow(
	new Error('There should be an element with id of "root" in index.html')
);

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
