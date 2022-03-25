import './Refresh.scss';
import Icon from './Icon.js';
import { useState, useEffect } from 'react';

export default function Refresh(props) {

  const [ time, setTime ] = useState(0);

  useEffect(() => {
    let id = setInterval(() => {
      setTime(time + 1);
      if (time >= parseInt(props.timeout)) {
        setTime(0);
        props.onRefresh();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [ time, props ]);

  return (
    <div className="Refresh" onClick={ (e) => { props.onRefresh(); setTime(0); } }>
      <Icon>refresh</Icon>
      <div className="track">
        <div className="bar" style={ { width: ((time / props.timeout) * 100) + '%' } }></div>
      </div>
    </div>
  )
}
