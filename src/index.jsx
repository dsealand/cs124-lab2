import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const initialData = [
  {
    id: 1,
    text: 'Get groceries',
    isCompleted: true,
  },
  {
    id: 2,
    text: 'Buy book',
    isCompleted: true,
  },
  {
    id: 3,
    text: 'call mom',
    isCompleted: false,
  }
]

ReactDOM.render(
  <React.StrictMode>
    <App data={initialData}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
