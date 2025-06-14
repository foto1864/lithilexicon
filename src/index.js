import React from 'react';
import ReactDOM from 'react-dom/client';

// Import from current
import App from './App';

// Import from 'styles'
import './/styles/index.css';

// Import from 'user'
import { UserProvider } from './/user/UserContext';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';


const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
