import './Points.scss';
import { useState } from 'react';
import Number from './Number.js';

export default function Points(props) {
  const [ points, setPoints ] = useState(parseInt(props.value) || 0);

  function handleSet() {
    props.onSet(parseInt(points));
  }
  function changePoints(e) {
    setPoints(parseInt(e));
  }

  const cls = parseInt(points) === parseInt(props.value) ? 'disabled set' : 'set';

  return (
    <div className="Points">
      <Number onChange={ changePoints } value={ points } className="points" size="1"/>
      <button onClick={ handleSet } className={ cls }>Setzen</button>
    </div>
  )
}
