import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { auth0Domain, auth0ClientId, isAuth0Configured } from './lib/auth0';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const app = <App />;

root.render(
  <React.StrictMode>
    {isAuth0Configured ? (
      <Auth0Provider
        domain={auth0Domain as string}
        clientId={auth0ClientId as string}
        authorizationParams={{ redirect_uri: window.location.origin }}
      >
        {app}
      </Auth0Provider>
    ) : (
      app
    )}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
