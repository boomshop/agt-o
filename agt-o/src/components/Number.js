import './Number.scss';
import { useState } from 'react';
import Icon from './Icon.js';

export default function Number(props) {
  const [ value, setValue ] = useState(parseFloat(props.value));

  function onMinus() {
    const val = Math.max(0, value - 1);
    setValue(val);
    props.onChange(val);
  }
  function onPlus() {
    const val = value + 1;
    setValue(val);
    props.onChange(val);
  }
  function onChange(e) {
    const val = parseFloat(e.target.value) || 0;
    setValue(val);
    props.onChange(val);
  }
  return (
    <div className="Number">
      <button className="minus" onClick={ onMinus }><Icon>minus</Icon></button>
      <input onChange={ onChange } type="number" value={ value } size="4" />
      <button className="plus" onClick={ onPlus }><Icon>plus</Icon></button>
    </div>
  )
}
