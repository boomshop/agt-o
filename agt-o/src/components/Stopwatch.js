import './Stopwatch.scss';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTimer } from 'react-use-precision-timer';

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
  return d;
}

export default function Stopwatch(props) {
  const { onSet } = props;

  const [ time, setTime ] = useState(0);
  const [ TO, setTO ] = useState(0);

  const timer = useTimer({ delay: 0 });

  useEffect(() => {
    let to = -1;
    if (TO)
      to = setTimeout(() => {
        setTime(timer.getElapsedRunningTime());
      }, TO);
    return () => {
      clearTimeout(to);
    };
  }, [ TO, time ]);

  const handleSet = () => {
    onSet((time / 1000).toFixed(2));
    setTime(0);
  }
  const handleRunning = () => {
    if (timer.isStopped() && time) {
      setTime(0);
    } else if (timer.isStopped()) {
      setTO(5);
      timer.start();
    } else {
      setTime(timer.getElapsedRunningTime());
      setTO(0);
      timer.stop();
    }
  }

  const ms = time % 1000;
  const seconds = parseInt(time / 1000) % 60;
  const minutes = Math.floor(parseInt(time / 1000) / 60);
  const display = moment(time).format('mm:ss.SS');

  return (
    <div className="Stopwatch">
      <svg width="100" height="100" viewBox="0 0 100 100" onClick={ handleRunning }>
        <path className="base ms" d={ describeArc(50, 50, 40, 0, 359.99) }/>
        <path className="base seconds" d={ describeArc(50, 50, 37.5, 0, 359.99) }/>
        <path className="base minutes" d={ describeArc(50, 50, 34, 0, 359.99) }/>
        <path className="time ms" d={ describeArc(50, 50, 40, 0, (ms / 1000) * 359.99) } />
        <path className="time seconds" d={ describeArc(50, 50, 37.5, 0, (seconds / 60) * 359.99) } />
        <path className="time minutes" d={ describeArc(50, 50, 34, 0, (minutes / 60) * 359.99) } />
      </svg>
      <span className="time">{ display }</span>
      <span className="controls">
        <button className={ !time || !timer.isStopped() ? 'disabled set' : 'set' } onClick={handleSet}>Übernehmen</button>
      </span>
    </div>
  )
}
