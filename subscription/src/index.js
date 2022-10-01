import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Elements} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';

const root = ReactDOM.createRoot(document.getElementById('root'));

const stripePromise = loadStripe('{{ENTER_PUBLISHABLE_KEY}}')

root.render(
  <Elements stripe={stripePromise}>
    <App />
  </Elements>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
