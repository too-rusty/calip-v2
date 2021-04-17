import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
// import { useBeforeunload } from 'react-beforeunload'
// import { Beforeunload } from 'react-beforeunload';;
import ls from 'local-storage'

// axios.defaults.headers.common['token'] = ls.get('token')

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

