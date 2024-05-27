import * as React from 'react';

export function ControlPanel({}) {
  return (
    <div className="control-panel">
      <h3>Basic Map</h3>
      <p>
        The simplest example possible, just rendering a google map with some
        settings adjusted.
      </p>
    </div>
  );
}

export const ControlPanelView: any = React.memo(ControlPanel);