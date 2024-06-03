import React, { useEffect, useState } from 'react'
import { WebR } from 'webr';
const webR = new WebR();

async function getRandomNumbers() {
  await webR.init();
  const result: any = await webR.evalR('rnorm(20,10,10)');
  try {
    return await result.toArray();
  } finally {
    webR.destroy(result);
  }
}

function WebRView() {
    const [ values, updateResult ] = useState(['Loading webR...']);
    useEffect(() => {
      (async ()=>{
        const values = await getRandomNumbers();
        updateResult(values);
      })();
    }, []);
    return (
      <div className="WebRView">
        <p>Result of running R code:</p>
        {values.map((n, idx) => <p key={idx}>{n}</p>)}
      </div>
    );
}

export default React.memo(WebRView);