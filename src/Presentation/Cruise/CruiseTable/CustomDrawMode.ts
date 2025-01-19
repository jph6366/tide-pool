import { DrawCustomMode, DrawCustomModeThis } from '@mapbox/mapbox-gl-draw';
import { GeoJSON } from 'geojson';
import { atom } from 'jotai';
interface Rectangle {
  north: number
  west: number
  east: number
  south: number
}

export const boundsAtom = atom<Rectangle>({
  north: 34,
  west: -74,
  east: -76,
  south: 33
});



const GMRTMapToolMode: DrawCustomMode = {
    toDisplayFeatures: function (this: DrawCustomModeThis & DrawCustomMode<any, any>, state: any, geojson: GeoJSON, display: (geojson: GeoJSON) => void): void {
        throw new Error('Function not implemented.');
    }
};

GMRTMapToolMode.onSetup = function(opts) {
    const rectangle = this.newFeature({
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            coordinates: [[]]
        }
        });
    this.addFeature(rectangle);
    this.clearSelectedFeatures();
    this.updateUIClasses({mouse: 'add'});
    this.setActionableState({
        trash: true,
        combineFeatures: false,
        uncombineFeatures: false
    });
    return {
        rectangle
    };
}

GMRTMapToolMode.onClick = function(state, e) {
    if (
        state.startPoint &&
        state.startPoint[0] !== e.lngLat.lng &&
        state.startPoint[1] !== e.lngLat.lat 
    ) {
        this.updateUIClasses({mouse: 'pointer'});
        state.endpoint = [e.lngLat.lng, e.lngLat.lat];
        this.changeMode('simple_select', { featuresID: state.rectangle.id});
    }

    const startPoint = [e.lngLat.lng, e.lngLat.lat];
    state.startPoint = startPoint;
};

GMRTMapToolMode.onMouseMove = function(state, e) {
    if (state.startPoint) {
        state.rectangle.updateCoordinate(
          '0.0',
          state.startPoint[0],
          state.startPoint[1]
        ); // minX, minY - the starting point
        state.rectangle.updateCoordinate(
          '0.1',
          e.lngLat.lng,
          state.startPoint[1]
        ); // maxX, minY
        state.rectangle.updateCoordinate('0.2', e.lngLat.lng, e.lngLat.lat); // maxX, maxY
        state.rectangle.updateCoordinate(
          '0.3',
          state.startPoint[0],
          e.lngLat.lat
        ); // minX,maxY
        state.rectangle.updateCoordinate(
          '0.4',
          state.startPoint[0],
          state.startPoint[1]
        ); // minX,minY - ending point (equals to starting point)
      }
}

GMRTMapToolMode.onKeyUp = function(state, e) {
    if(e.keyCode === 27) return this.changeMode('simple_select');
}

GMRTMapToolMode.onStop = function(state) {
    this.updateUIClasses({ mouse: 'none' });
    this.activateUIButton();

    // check to see if we've deleted this feature
    if (this.getFeature(state.rectangle.id) === undefined) return;

    // remove last added coordinate
    state.rectangle.removeCoordinate('0.4');
    if (state.rectangle.isValid()) {
      this.map.fire('draw.create', {
        features: [state.rectangle.toGeoJSON()]
      });
    } else {
      this.deleteFeature([state.rectangle.id], { silent: true });
      this.changeMode('simple_select', {}, { silent: true });
    }
}

GMRTMapToolMode.toDisplayFeatures = function(state, geojson, display) {
    const isActivePolygon = geojson.properties.id === state.rectangle.id;
    geojson.properties.active = isActivePolygon ? "true" : "false";
    if (!isActivePolygon) return display(geojson);

    // Only render the rectangular polygon if it has the starting point
    if (!state.startPoint) return;
    return display(geojson);
}

GMRTMapToolMode.onTrash = function(state) {
    this.deleteFeature([state.rectangle.id], {silent: true});
    this.changeMode('simple_select');
}

export default GMRTMapToolMode;