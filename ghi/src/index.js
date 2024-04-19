import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import { store } from './store/store';
// import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
// import { PullsContext, PullsContextProvider } from "./context/PullsContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
// const { pulls } = useContext(PullsContext)

root.render(
  <React.StrictMode>
    {/* <PullsContextProvider> */}
      <App />
    {/* </PullsContextProvider> */}
  </React.StrictMode>
);

reportWebVitals();
