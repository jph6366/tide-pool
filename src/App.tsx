import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import MapGL from 'react-map-gl/mapbox';
import './index.css';
import CruiseTableView from './Presentation/Cruise/CruiseTable/CruiseTableView';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import Footer from './Presentation/Footer/Footer'
import CesiumViewer from './Presentation/Cesium/CesiumViewer/CesiumViewer';

const MainContext = React.createContext({});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <BrowserRouter>
        <MainContext.Provider value={{}}>
          <CesiumViewer/>
          <CruiseTableView/>
          <Footer/>
        </MainContext.Provider>
      </BrowserRouter>
  </React.StrictMode>,
);
