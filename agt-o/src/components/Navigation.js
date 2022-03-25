import './Navigation.scss';
import { useState } from 'react';
import Icon from './Icon.js';

export default function Navigation(props) {
  const [ current, setCurrent ] = useState(props.active);

  function onClick(e) {
    return function () {
      props.onSwitch(e);
      setCurrent(e);
    }
  }

  const buttons = [];
  for (let i = 0, m = props.entries.length; i < m; ++i) {
    const E = props.entries[i];
    const icon = E.icon ? <Icon>{ E.icon }</Icon> : null;
    buttons.push(<button key={ E.value } onClick={ onClick(E.value) } className={ current === E.value ? 'active' : '' }>{ icon }{ E.name }</button>)
  }

  return (
    <div className="Navigation">
      { buttons }
    </div>
  )
}
