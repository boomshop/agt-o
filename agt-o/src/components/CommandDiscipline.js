import './CommandDiscipline.scss';
import Icon from './Icon.js';
import moment from 'moment';

export default function CommandDiscipline(props) {
  const { data, discipline } = props;

  return (
    <div className="CommandDiscipline" title={ data.valuation_date && data.valuation_referee_name ? 'Bewertung durch ' + data.valuation_referee_name + ' um ' + moment(parseInt(data.valuation_date) * 1000).format('HH:mm:ss - DD.MM.YYYY') : '' }>
        <span className={ "label " + data.progress || '' }>Disziplin { discipline.number }</span>

      <span className="points">
        <Icon>medal</Icon>
        <span className="points">{ parseInt(data.points) ? (parseInt(data.points) * parseFloat(discipline.multiplier)) + ' (' + data.points + ')' : '--' }</span>
      </span>
      {
        parseInt(data.penalty) ? <>
          <span className="penalty">
            <Icon>referee</Icon>
            <span className="penalty">{ parseInt(data.penalty) ? (parseInt(data.penalty) * parseFloat(discipline.faults)) + ' (' + data.penalty + ')' : '--' }</span>
          </span>
          <span className="reason">{ data.reason }</span>
        </> : null
      }
    </div>
  )
}
