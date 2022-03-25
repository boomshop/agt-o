import './RefereeTeam.scss';
import Icon from './Icon.js';
import { Stati } from '../stati.js';

export default function RefereeTeam(props) {
  const { data, user } = props;

  const status = Stati[data.state || 'default'].name;
  const color = Stati[data.state || 'default'].color;
  const points = data.points ? (parseFloat(data.points || 0) * parseFloat(data.multiplier || 1)).toFixed(2) : '--';

  function clickEdit(e) {
    props.onEdit(data);
  }
  return (
    <div className="RefereeTeam Item" key={ 'team' + data.number }>
      <span className="id">{ data.number }</span>
      <span className="title"><span className="title">{ data.name }</span><span className="state" style={ { background: color } }><Icon>status</Icon><span className="status">{ status }</span></span></span>
      <span className="pointsi"><Icon>medal</Icon></span>
      <span className="pointsd">Punkte</span>
      <span className="points">{ points } { data.referee === user.id ? <Icon>user</Icon> : null }</span>
      {
        parseFloat(data.penalty || 0) ? <>
          <span className="penaltyi"><Icon>referee</Icon></span>
          <span className="penaltyd">Strafe</span>
          <span className="penalty">{ parseFloat(data.penalty || 0).toFixed(2) }</span>
          <span className="reason">({ data.reason })</span>
        </> : null
      }
      <button className="edit" onClick={ clickEdit }><Icon>edit</Icon></button>
    </div>
  )
}
