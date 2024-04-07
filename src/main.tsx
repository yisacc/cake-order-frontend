import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './react-query/client.ts';
import { StateContextProvider } from './providers/user-provider.tsx';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <StateContextProvider>
        <App />
        </StateContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
