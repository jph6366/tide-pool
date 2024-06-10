import {createStore} from 'redux';
import { atomWithStore } from 'jotai-redux';

function mapStateReducer(state:any , action:any) {
  switch (action.type) {
    case 'setViewState':
      return {...state, viewState: action.payload};

    default:
      return state;
  }
}

const defaultMapState = {
  mapStyle: 'mapbox://styles/mapbox/dark-v9',
  viewState: {
    latitude: 32.8,
    longitude: -77.4,
    zoom: 4
  }
};

const store = createStore(mapStateReducer, defaultMapState);
const mapStateAtom = atomWithStore(store);

export default mapStateAtom;