import React, { useEffect, useState } from 'react'
import Plotly from 'plotly.js'
import { WebR } from 'webr';
const webR = new WebR({ interactive: false });

async function getRandomNumbers() {
  await webR.init();
  const outElem = document.getElementById('out');
  await webR.installPackages(['jsonlite', 'ggplot2', 'plotly'],{ mount: true });

  const result: any = await webR.evalRString(`
  library(plotly)
  library(ggplot2)
  
  p <- ggplot(mpg, aes(displ, hwy, colour = class)) +
    geom_point()
  
  plotly_json(p, pretty = FALSE)
  `);
  outElem?.replaceChildren();
  Plotly.newPlot('out', JSON.parse(result), {});
}

function WebRView() {
    useEffect(() => {
      (async ()=>{
        await getRandomNumbers();
      })();
    }, []);
    return (
    <div className='w-full'>
        <pre><code id="out">Loading webR, please wait...</code></pre>
      </div>
    );
}

export default React.memo(WebRView);