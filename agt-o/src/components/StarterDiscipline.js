import './StarterDiscipline.scss';
import Icon from './Icon.js';
import { Stati } from '../stati.js';

export default function StarterDiscipline(props) {
  const { data } = props;

  const status = Stati[data.state || 'default'].name;
  const color = Stati[data.state || 'default'].color;
  const points = (parseFloat(data.points || 0) * parseFloat(data.multiplier || 1)) || '--';

  return (
    <div className="StarterDiscipline" key={ 'discipline' + data.number }>
      <span className="number">{ data.number }</span>
      <span className="title">{ data.name } <span style={ { color: color } }><Icon>status</Icon><span className="status">{ status }</span></span></span>
      <span className="description">{ data.description }</span>
      <span className="pointsi"><Icon>medal</Icon></span>
      <span className="pointsd">Punkte</span>
      <span className="points">{ points }</span>
      {
        parseInt(data.penalty || 0) ? <>
          <span className="penaltyi"><Icon>referee</Icon></span>
          <span className="penaltyd">Strafe</span>
          <span className="penalty">{ parseInt(data.penalty || 0) }</span>
          <span className="reason">({ data.reason })</span>
        </> : null
      }
    </div>
  )
}
