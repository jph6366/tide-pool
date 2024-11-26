import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Store from './Presentation/ReduxStore/Store';
import './styles.css';
import CruiseListView from './Presentation/Cruise/CruiseList/CruiseListView';
import '/node_modules/flag-icons/css/flag-icons.min.css';

const MainContext = React.createContext({});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <MainContext.Provider value={{}}>
          <CruiseListView/>
        </MainContext.Provider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
