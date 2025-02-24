/* eslint-disable camelcase */
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useCallback, useEffect, useState } from 'react';
import { ControlPosition, MapRef, useControl, MapInstance } from 'react-map-gl/mapbox';
import GMRTPolylineToolMode, { profileAtom } from '../GeodesicDrawMode';
import { Coordinate } from '@/Data/DataSource/API/Parameter/CoordinateParameter';
import arc from 'arc';
import { useDrawMode } from './Atoms/drawModeAtom';

export default function DrawMode() {

  const{ drawMode, setDrawMode} = useDrawMode();


  function isEventAtCoordinates(event: { lngLat: { lng: any; lat: any; }; }, coordinates: any[]) {
      if (!event.lngLat) return false;
      return event.lngLat.lng === coordinates[0] && event.lngLat.lat === coordinates[1];
  }
  
  const GMRTPolylineToolMod = GMRTPolylineToolMode
    // @ts-expect-error expect

  GMRTPolylineToolMod.clickAnywhere = function (state: any, e: any) {
      if (
        (state.currentVertexPosition > 0 &&
          isEventAtCoordinates(
            e,
            state.line.coordinates[state.currentVertexPosition - 1]
          )) ||
        (state.direction === 'backwards' &&
          isEventAtCoordinates(
            e,
            state.line.coordinates[state.currentVertexPosition + 1]
          ))
      ) {    // @ts-expect-error expect

        return this.changeMode(MapboxDraw.constants.modes.SIMPLE_SELECT, {
          featureIds: [state.line.id],
        });
      }
        // @ts-expect-error expect

      this.updateUIClasses({ mouse: MapboxDraw.constants.cursors.ADD });
    
      // Update the current vertex
      state.line.updateCoordinate(
        state.currentVertexPosition,
        e.lngLat.lng,
        e.lngLat.lat
      );
    
      if (state.direction === 'forward') {
        state.currentVertexPosition++;
        state.line.updateCoordinate(
          state.currentVertexPosition,
          e.lngLat.lng,
          e.lngLat.lat
        );
      } else {
        state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
      }
    
      // Store all active coordinates in arcs
      const updatedCoordinates = state.line.coordinates.map(([lng, lat]:any) => ({
        latitude: lat,
        longitude: lng,
      }));
  };    // @ts-expect-error expect

  GMRTPolylineToolMod.clickOnVertex = function(state:any) {    // @ts-expect-error expect

      return this.changeMode(MapboxDraw.constants.modes.SIMPLE_SELECT, { featureIds: [state.line.id] });
  };

  GMRTPolylineToolMod.onClick = function(state:any, e:any) {
      if(MapboxDraw.lib.CommonSelectors.isVertex(e)) {    // @ts-expect-error expect

          return this.clickOnVertex(state, e);
      }    // @ts-expect-error expect

      this.clickAnywhere(state, e);
  };
    
  type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
    position: ControlPosition;
  
    onCreate: (evt: {features: object[]}) => void;
    onUpdate: (evt: {features: object[]; action: string}) => void;
    onDelete: (evt: {features: object[]}) => void;
  };

const [features, setFeatures] = useState({});


  function DrawControl(props: DrawControlProps) {

      useControl<MapboxDraw>(
        () => new MapboxDraw(props),
        ({map}: {map: MapRef}) => {
          map.on('draw.create', props.onCreate);
          map.on('draw.update', props.onUpdate);
          map.on('draw.delete', props.onDelete);
        },
        ({map}: {map: MapRef}) => {
          map.off('draw.create', props.onCreate);
          map.off('draw.update', props.onUpdate);
          map.off('draw.delete', props.onDelete);
        },
        {
          position: props.position
        }
      );
      return null;
  }


  return {
    DrawControl,
    drawMode, setDrawMode,
    GMRTPolylineToolMod
  }

}


