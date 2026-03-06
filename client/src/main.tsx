// client/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './assets/css/fonts.css';
import ScrollToTop from './utils/ScrollToTop.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* 2. Bungkus <App /> */}
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)