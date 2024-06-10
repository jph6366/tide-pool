import {useCallback, useState, useEffect} from 'react';
import {useAtom} from 'jotai';
import mapStateAtom from '../JotaiStore/Store';

export default function JotaiControls() {
  const [state, dispatch] = useAtom(mapStateAtom);
  const viewState = state.viewState;
  const [inputValue, setInputValue] = useState('');
  const [hasError, setError] = useState(false);

  useEffect(() => {
    setInputValue(`${viewState.longitude.toFixed(3)}, ${viewState.latitude.toFixed(3)}`);
    setError(false);
  }, [viewState]);

  const onChange = useCallback((evt:any) => {
    setInputValue(evt.target.value);
  }, []);

  const onSubmit = useCallback(() => {
    const [lng, lat] = inputValue.split(',').map(Number);
    if (Math.abs(lng) <= 180 && Math.abs(lat) <= 85) {
      dispatch({
        type: 'setViewState',
        payload: {...viewState, longitude: lng, latitude: lat}
      });
      setError(false);
    } else {
      setError(true);
    }
  }, [inputValue, viewState, dispatch]);

  return (
    <div style={{padding: 12, fontFamily: 'sans-serif'}}>
      <span>MAP CENTER: </span>
      <input
        type="text"
        value={inputValue}
        onChange={onChange}
        style={{color: hasError ? 'red' : 'black'}}
      />
      <button onClick={onSubmit}>GO</button>
    </div>
  );
}
