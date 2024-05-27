import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/store';
import './styles.css';
import CruiseListView from './Presentation/Cruise/CruiseList/CruiseListView';
// import VisGLReactGoogleMaps from './Presentation/Map/VisGLGoogleMaps';
import MapBox from './Presentation/Map/MapGLMapbox';

const MainContext = React.createContext({});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <MainContext.Provider value={{}}>
          {/* <MapBox/> */}
          {/* <VisGLReactGoogleMaps/>W */}
          <CruiseListView/>
        </MainContext.Provider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
