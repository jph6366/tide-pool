import React, { forwardRef, useImperativeHandle } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useControl, ControlPosition, MapRef } from 'react-map-gl';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position: ControlPosition;
  onCreate: (evt: { features: object[] }) => void;
  onUpdate: (evt: { features: object[]; action: string }) => void;
  onDelete: (evt: { features: object[] }) => void;
};

// Use forwardRef to expose the MapboxDraw instance to the parent
const DrawControl = forwardRef<MapboxDraw, DrawControlProps>((props, ref) => {
  // @ts-expect-error expects react-map-gl MapInstance but we reference mapboxgl.Map instance
  const draw = useControl<MapboxDraw>(  
    () => new MapboxDraw(props),
    ({ map }) => {
      map.on('draw.create', props.onCreate);
      map.on('draw.update', props.onUpdate);
      map.on('draw.delete', props.onDelete);
    },
    ({ map }) => {
      map.off('draw.create', props.onCreate);
      map.off('draw.update', props.onUpdate);
      map.off('draw.delete', props.onDelete);
    },
    {
      position: props.position,
    }
  );

  // Expose the draw instance via ref
  useImperativeHandle(ref, () => draw, [draw]);

  return null; // This is a non-visual component.
});

DrawControl.displayName = 'DrawControl'

export default DrawControl;
