import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'react-toastify/dist/ReactToastify.css';
import './tailwind.css';
//import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
		{/*<ToastContainer />*/}
	</React.StrictMode>
)