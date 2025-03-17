/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

const CesiumViewer: React.FC = () => {


const [open, setOpen] = useState(false);
    

  useEffect(() => {

    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

    // Attribution for basemaps
    const CartoAttribution =
      'Map tiles by <a href="https://carto.com">Carto</a>, under CC BY 3.0. Data by <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, under ODbL.';

// Create ProviderViewModel for the base layer selector (optional)
const imageryViewModels = [
  new Cesium.ProviderViewModel({
    name: 'OpenStreetMap',
    iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
    tooltip: 'OpenStreetMap (OSM) is a collaborative project to create a free editable map of the world.\nhttp://www.openstreetmap.org',
    creationFunction: () => new Cesium.UrlTemplateImageryProvider({
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: 'abc',
      minimumLevel: 0,
      maximumLevel: 19,
    }),
  }),
  // Add other ProviderViewModels if needed
  new Cesium.ProviderViewModel({
    name: 'GMRT',
    iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/stamenWatercolor.png'), // Replace with an appropriate icon
    tooltip: 'Global Multi-Resolution Topography (GMRT) provides global bathymetric data.\nhttps://www.gmrt.org/',
    creationFunction: () => new Cesium.WebMapServiceImageryProvider({
        url: 'https://www.gmrt.org/services/mapserver/wms_merc?',
        layers: 'topo',
        parameters: {
          service: 'WMS',
          version: '1.3.0', // Ensure correct WMS version
          request: 'GetMap',
          styles: '',
          format: 'image/png', // Use PNG for transparency support
          transparent: true,
          crs: 'EPSG:3857' // Change to 'EPSG:4326' if needed
        },
        tilingScheme: new Cesium.WebMercatorTilingScheme(), // Ensure correct projection
      })
  }),
];

// Initialize the Cesium viewer
const viewer = new Cesium.Viewer('cesiumContainer', {
  imageryProviderViewModels: imageryViewModels, // Optional: for base layer switching
  selectedImageryProviderViewModel: imageryViewModels[0], // Set default base layer
  animation: false,
  timeline: false,
  infoBox: false,
  homeButton: false,
  fullscreenButton: false,
  selectionIndicator: false,
});


const blueTopoLayer = viewer.imageryLayers.addImageryProvider(
  new Cesium.WebMapServiceImageryProvider({
    url: 'https://nowcoast.noaa.gov/geoserver/bluetopo/wms?',
    layers: 'bathymetry',
    parameters: {
      service: 'WMS',
      version: '1.3.0',
      request: 'GetMap',
      styles: 'nbs_elevation',
      format: 'image/png8',
      transparent: true,
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 19,
    credit: 'NOAA NowCOAST',
  })
);

// Adjust layer order and opacity if needed
viewer.imageryLayers.raiseToTop(blueTopoLayer); // Move Blue Topo layer to the top
blueTopoLayer.alpha = 0.5; // Set opacity of the top layer (0.5 = 50% transparency)

    // Remove the Terrain section of the baseLayerPicker
    viewer.baseLayerPicker.viewModel.terrainProviderViewModels.length = 0;

    // Cleanup the Cesium viewer on component unmount
    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, []);

  
  
  
  return  (       
  <div className='min-h-screen bg-gray-50 py-6 flex flex-col items-center justify-center relative overflow-hidden sm:py-12'>
  <div  onClick={() => setOpen(!open)} className="p-4 bg-gray-700 w-1/2 rounded flex justify-between items-center">
      <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm text-blue-500">GMRT-GLOBE</h4>
      </div>

    </div>
      <div className="relative w-full overflow-x-clip ">
          <p className="mt-4 text-center text-gray-500 sm:text-lg lg:text-left lg:text-lg">Acknowledgement</p>
          <p className="mt-4 text-center text-gray-500 lg:text-left lg:text-xs w-2/3">FOIA provides that any person has a right to obtain access to federal agency records, except to the extent that such records (or portions of them) are protected from public disclosure by one of nine FOIA exemptions or by one of three special law enforcement record exclusions. This right is enforceable in court.

            The Federal FOIA does not provide access to records held by U.S. state or local government agencies or by businesses or individuals. States have their own statutes governing public access to state and local records, and they should be consulted for further information.</p>
          <br/>
          <a href='https://www.gmrt.org/' className='text-blue-900'>Global Multi-Resolution Topography (GMRT)</a>
          <p className="mt-4 text-center text-gray-500 lg:text-left lg:text-xs w-2/6">
          Ryan, W. B. F., S.M. Carbotte, J. Coplan, S. O'Hara, 
          A. Melkonian, R. Arko, R.A. Weissel, V. Ferrini, 
          A. Goodwillie, F. Nitsche, J. Bonczkowski, and R. Zemsky (2009), 
          Global Multi-Resolution Topography (GMRT) synthesis data set, Geochem. Geophys. Geosyst., 10, Q03014,
          </p>
          <br/>
          <div id="cesiumContainer" style={{ width: '100%', height: '100%' }} />;
          </div>

</div>
)
  
};

export default CesiumViewer;
