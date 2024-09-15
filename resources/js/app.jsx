import './bootstrap';
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

function App() {
    return (
        <React.StrictMode>
            <Dashboard />
            <ToastContainer />
        </React.StrictMode>
    );
}

const rootElement = document.getElementById('dashboard');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
}
