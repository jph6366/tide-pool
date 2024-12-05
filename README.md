# Tide-Pool :ocean:

## About

Tide-pool is a sandbox BRX project, built in [Typescript 4.9](https://www.typescriptlang.org) using [React 18](https://reactjs.org/).
- The goal of this project is to create repositories  of direct links to public federal data with provided select, search, filter, and various display options.

**Noteworthy Tooling Included:**

- [Vite](https://github.com/vitejs) - Build tool and dev server
- [Jotai](https://jotai.org/) - Atomic approach to global React state management
- [TailwindCSS](https://tailwindcss.com) - CSS utilities
- [React-Map-GL](https://visgl.github.io/react-map-gl/) - React Wrapper for [Mapbox-GL](https://docs.mapbox.com/mapbox-gl-js)

  [Global Multi-Resolution Topography Data Synthesis](https://www.gmrt.org) is a multi-resolutional compilation of edited multibeam sonar data collected by scientists and institutions worldwide, that is reviewed, processed and gridded by the GMRT Team and merged into a single continuously updated compilation of global elevation data. The synthesis began in 1992 as the Ridge Multibeam Synthesis (RMBS), was expanded to include multibeam bathymetry data from the Southern Ocean, and now includes bathymetry from throughout the global and coastal oceans.   [GMRT Web Services](https://www.gmrt.org/services/index.php)


  
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


## Diagrams

    ![image](https://github.com/jph6366/tide-pool/blob/bathy-req/flowofcontrol.drawio.png)

