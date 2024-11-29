import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Store from './Presentation/ReduxStore/Store';
import './index.css';
import CruiseTableView from './Presentation/Cruise/CruiseTable/CruiseTableView';
import '/node_modules/flag-icons/css/flag-icons.min.css';

const MainContext = React.createContext({});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <MainContext.Provider value={{}}>
          <CruiseTableView/>
        </MainContext.Provider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
