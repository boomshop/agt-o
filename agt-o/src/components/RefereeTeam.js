import './RefereeTeam.scss';
import Icon from './Icon.js';
import { Stati } from '../stati.js';

export default function RefereeTeam(props) {
  const { data, user, discipline } = props;

  const status = Stati[data.state || 'default'].name;
  const color = Stati[data.state || 'default'].color;

  const points = parseFloat(data.points) ? (parseFloat(data.points || 0) * parseFloat(discipline.multiplier || 1)).toFixed(2) : '--';
  const pointsdetails = parseFloat(data.points) ? data.points + ' ' + (discipline.type === 'seconds' ? 'Sek.' : 'Fehler') : '';
  const penalty = parseFloat(data.penalty) ? Math.round(parseFloat(data.penalty) * parseFloat(discipline.faults || 1)) : '--';
  const penaltydetails = parseFloat(data.penalty) ? data.penalty + ' Fehler' : '';

  function clickEdit(e) {
    props.onEdit(data);
  }
  return (
    <div className="RefereeTeam Item" key={ 'team' + data.number }>
      <span className="id">{ data.number }</span>
      <span className="title"><span className="title">{ data.name }</span><span className="state" style={ { background: color } }><Icon>status</Icon><span className="status">{ status }</span></span></span>
      <span className="pointsi"><Icon>medal</Icon></span>
      <span className="pointsd">Punkte</span>
      <span className="points">{ points } <span class="small">({ pointsdetails })</span> { data.referee === user.id ? <Icon>user</Icon> : null }</span>
      {
        parseFloat(data.penalty || 0) ? <>
          <span className="penaltyi"><Icon>referee</Icon></span>
          <span className="penaltyd">Strafe</span>
          <span className="penalty">{ penalty }</span>
          <span className="reason">({ penaltydetails }: { data.reason })</span>
        </> : null
      }
      <button className="edit" onClick={ clickEdit }><Icon>edit</Icon></button>
    </div>
  )
}
