import {createStore} from 'redux';

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

export default createStore(mapStateReducer, defaultMapState);