import './Date.scss';
import { useRef, useState } from 'react';

export default function Date(props) {
  const dayE = useRef();
  const monthE = useRef();
  const yearE = useRef();

  function onChange(e) {
    const day = parseInt(dayE.current.value) || 1;
    const month = parseInt(monthE.current.value) || 0;
    const year = parseInt(yearE.current.value) || 0;
    const D = new Date();
    D.setDate(day);
    D.setMonth(month + 1);
    D.setFullYear(year);
    props.onChange(D.valueOf());
  }

  return (
    <>
      <input ref={ dayE } type="text" value={ day } onChange={ onChange }/>
      <input ref={ monthE } type="text" value={ month } onChange={ onChange }/>
      <input ref={ yearE } type="text" value={ year } onChange={ onChange }/>
    </>
  )
}
