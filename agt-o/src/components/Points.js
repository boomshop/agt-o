import './Points.scss';
import { useState } from 'react';

export default function Points(props) {
  const [ points, setPoints ] = useState(props.value || 0);

  function handleSet() {
    props.onSet(points);
  }
  function changePoints(e) {
    setPoints(e.target.value || 0);
  }

  return (
    <div className="Points">
      <input type="number" onChange={ changePoints } value={ points } className="points" size="1"/>
      <button onClick={ handleSet } className="set">Setzen</button>
    </div>
  )
}
