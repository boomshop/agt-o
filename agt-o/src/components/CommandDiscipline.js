import './CommandDiscipline.scss';
import Icon from './Icon.js';
import moment from 'moment';

export default function CommandDiscipline(props) {
  const { data, discipline } = props;

  const points = parseFloat(data.points) ? (parseFloat(data.points || 0) * parseFloat(discipline.multiplier || 1)).toFixed(2) : '--';
  const pointsdetails = parseFloat(data.points) ? data.points + ' ' + (discipline.type === 'seconds' ? 'Sek.' : 'Fehler') : '';
  const penalty = parseFloat(data.penalty) ? Math.round(parseFloat(data.penalty) * parseFloat(discipline.faults || 1)) : '--';
  const penaltydetails = parseFloat(data.penalty) ? data.penalty + ' Fehler' : '';

  let title = '';
  if (data.valuation_date && data.valuation_referee_name)
    title = 'Bewertung durch ' + data.valuation_referee_name + ' um ' + moment(parseInt(data.valuation_date) * 1000).format('HH:mm:ss - DD.MM.YYYY');
  if (data.penalty)
    title += ' | Fehler: ' + data.reason;

  return (
    <div className="CommandDiscipline" title={ title }>
        <span className={ "label " + data.progress || '' }>Disziplin { discipline.number }</span>

      <span className="points">
        <Icon>medal</Icon>
        <span className="points">{ points } <span className="small">{ pointsdetails }</span></span>
      </span>
      {
        parseInt(data.penalty) ? <>
          <span className="penalty">
            <Icon>referee</Icon>
            <span className="penalty">{ penalty }</span>
          </span>
          <span className="reason">{ penaltydetails }: { data.reason }</span>
        </> : null
      }
    </div>
  )
}
