import { Units } from '@turf/helpers';
import maplibregl from 'maplibre-gl';

declare module 'maplibre-grid' {

  export interface GridConfig {
    gridWidth: number;
    gridHeight: number;
    units: Units;
    minZoom?: number;
    maxZoom?: number;
    paint?: maplibregl.LinePaint;
  }

  export interface GridClickEvent {
    bbox: GeoJSON.BBox;
  }

}
