import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Store from './Presentation/ReduxStore/Store';
import './styles.css';
import CruiseListView from './Presentation/Cruise/CruiseList/CruiseListView';
// import VisGLReactGoogleMaps from './Presentation/Map/VisGLGoogleMaps';
import MapBox from './Presentation/Map/MapGLMapbox';
import VisGLReactGoogleMaps from './Presentation/Map/VisGLGoogleMaps';
import MapGLCluster from './Presentation/Map/MapGLCluster';

const MainContext = React.createContext({});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <MainContext.Provider value={{}}>
          {/* <MapGLCluster/> */}
          {/* <MapBox/> */}
          {/* <VisGLReactGoogleMaps/> */}
          <CruiseListView/>
        </MainContext.Provider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
