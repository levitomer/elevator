import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as Redux } from 'react-redux';
import configureStore from './store/config';
import App from 'components/App/App';
import './styles/main.scss';

const store = configureStore();

ReactDOM.render(
    <Redux store={store}>
        <App />
    </Redux>,
    document.getElementById('root')
);
