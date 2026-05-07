import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const API_URL = process.env.REACT_APP_API_URL || ''
const _fetch = window.fetch.bind(window)
window.fetch = function (url, options = {}) {
  if (typeof url === 'string' && API_URL && url.startsWith(API_URL)) {
    const token = localStorage.getItem('auth_token')
    if (token) {
      options = {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` }
      }
    }
  }
  return _fetch(url, options)
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
