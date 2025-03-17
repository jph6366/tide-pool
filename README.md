# Tide-Pool :ocean:

## About

Tide-pool is a sandbox BRX project, built in [Typescript 4.9](https://www.typescriptlang.org) using [React 19](https://reactjs.org/).
- The goal of this project is to re-implement [GMRT MapTool](https://github.com/mgds/gmrtMapTool) ( try it out [here](https://www.gmrt.org/GMRTMapTool/)) in the modern web development toolings below and further extend by integrating open source web gis technologies.
- Some other modern iterations of public-facing applications/tools that utilize GMRT-like web maps and tools.
  - Bedrock Ocean Exploration - [Mission](https://www.bedrockocean.com/mission) - [Mosaic](https://mosaic.bedrockocean.com/)
  - Seabed 2030 - [Mission](https://ccom.unh.edu/project/bathymetry-globe) - [BathyGlobe](https://seabed2030.org/)
  - NOAA Digital Coast - [Mission](https://coast.noaa.gov/digitalcoast/about/)

**Noteworthy Tooling Included:**

- [Vite](https://github.com/vitejs) - Build tool and dev server
- [Jotai](https://jotai.org/) - Atomic approach to global React state management
- [TailwindCSS](https://tailwindcss.com) - CSS utilities
- [React-Map-GL](https://visgl.github.io/react-map-gl/) - React Wrapper for [Mapbox-GL](https://docs.mapbox.com/mapbox-gl-js)
- [Storybook](https://67d84670b91c3a0fa31f09e3-ddbeapkbul.chromatic.com/) - View published Storybook here for testing UI components

**Original Tooling In [GMRTMapTool](https://www.gmrt.org/GMRTMapTool/):**

- JQuery
- OpenLayers
- Google Maps
- Google Charts


**Data and Metadata Provided by:**

  [Global Multi-Resolution Topography Data Synthesis](https://www.gmrt.org) is a multi-resolutional compilation of edited multibeam sonar data collected by scientists and institutions worldwide, that is reviewed, processed and gridded by the GMRT Team and merged into a single continuously updated compilation of global elevation data. The synthesis began in 1992 as the Ridge Multibeam Synthesis (RMBS), was expanded to include multibeam bathymetry data from the Southern Ocean, and now includes bathymetry from throughout the global and coastal oceans.

  
## Developing

The project requires Node 18 to be installed on your local machine, refer to npm for [download instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

1. Install project dependencies

```sh
npm install
```

2. Start the Dev Server

```sh
npm run dev
```

The dev server will launch in your browser at [localhost:4444](localhost:4444) and will automatically reload as you make changes.

[React Style Guide](https://mkosir.github.io/typescript-style-guide/#appendix---react)


### Solar System Exploration, 1950s – 1960s

- [ ] Refactor Components and File Structure to Scream
  - 3D Map Projection & Scene Rendering
  - 2D Map Projection & Map Editor Tools
  - OGC & REST Service Integration
- [ ] Deploy a React component library on top of gle-scene-components
  - Bathymetric Globe w/ 3D Scenes
  - Bathymetric Web Mercator Map w/ Map Editing
- [ ] Integrate 3D Models from 3DMR a Repository for 3D models, and their metadata, for use by the OSM community
  -  Incorporate SPZ, glTF, and OBJ

## Diagrams

  ![image](https://github.com/jph6366/tide-pool/blob/bathy-req/flowofcontrol.drawio.png)

