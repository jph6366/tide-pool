import React from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useControl, ControlPosition, MapRef } from 'react-map-gl';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position: ControlPosition;
  onCreate: (evt: { features: object[] }) => void;
  onUpdate: (evt: { features: object[]; action: string }) => void;
  onDelete: (evt: { features: object[] }) => void;
};

const DrawControl: React.FC<DrawControlProps> = (props) => {
  useControl<MapboxDraw>(
    () => new MapboxDraw(props),
    ({ map }: { map: MapRef }) => {
      map.on('draw.create', props.onCreate);
      map.on('draw.update', props.onUpdate);
      map.on('draw.delete', props.onDelete);
    },
    ({ map }: { map: MapRef }) => {
      map.off('draw.create', props.onCreate);
      map.off('draw.update', props.onUpdate);
      map.off('draw.delete', props.onDelete);
    },
    {
      position: props.position,
    }
  );

  return null; // This is important since this is a non-visual component.
};

export default DrawControl;
