import './State.scss';
import Icon from './Icon.js';
import { Stati } from '../stati.js';

export default function State(props) {
  const buttons = [];

  Object.keys(Stati).map((v, i) => {
    const state = Stati[v];
    const active = v === props.value || (v === 'default' && !props.value);
    if (v !== 'default')
      buttons.push(
        <button onClick={ () => { props.onSwitch(v) } } key={ 'button' + i } style={ active ? { background: state.color, color: '#244676' } : { borderColor: state.color, color: state.color } }>
          <Icon>{ v }</Icon>
          { state.name }
        </button>);
    return null;
  });

  return (
    <div className="State">
      { buttons }
    </div>
  )
}
