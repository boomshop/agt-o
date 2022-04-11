import './Points.scss';
import { useState } from 'react';
import Number from './Number.js';

export default function Points(props) {
  const [ points, setPoints ] = useState(parseFloat(props.value) || 0);

  function handleSet() {
    props.onSet(points);
  }
  function changePoints(e) {
    setPoints(e);
  }

  const cls = parseFloat(points) === parseFloat(props.value) ? 'disabled set' : 'set';

  return (
    <div className="Points">
      <Number onChange={ changePoints } value={ points } className="points" size="1"/>
      <button onClick={ handleSet } className={ cls }>Setzen</button>
    </div>
  )
}
