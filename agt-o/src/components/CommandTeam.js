import './CommandTeam.scss';
import CommandImage from './CommandImage.js';
import CommandStarter from './CommandStarter.js';
import CommandDiscipline from './CommandDiscipline.js';
import Icon from './Icon.js';
import { useState } from 'react';

export default function CommandTeam(props) {
  const { request, data, disciplines, config } = props;
  const [ edit, setEdit ] = useState(false);

  let points = parseInt(config.points || 0);
  data.disciplines.map((v, i) => {
    const d = data.disciplines[i];
    points -= ((parseFloat(d.points) || 0) * (parseFloat(disciplines[i].multiplier) || 1)) + ((parseFloat(d.penalty) || 0) * (parseFloat(disciplines[i].faults) || 1));
    return null;
  });

  const starters = [];
  data.starters.map((v, i) => {
    starters.push(<CommandStarter data={ v } key={ 'starter' + v.id } request={ request }/>);
    return null;
  });

  const disci = [];
  disciplines.map((v, i) => {
    disci.push(<CommandDiscipline discipline={ v } data={ data.disciplines[i] } key={ 'discipline' + v.id } />);
    return null;
  });

  let enabled = data.paid === '1' && data.image !== '';
  data.starters.map((v) => {
    enabled = enabled && v.g263 === '1' && v.disclaimer === '1';
  });

  function handlePaid(e) {
    request({
      action: 'editTeam',
      id: data.id,
      paid: e.target.checked ? '1' : '0',
    });
  }
  function handleEdit(e) {
    if (!edit) {
      const callback = () => { setEdit(false); document.removeEventListener('click', callback); }
      window.setTimeout(() => { document.addEventListener('click', callback); }, 50);
      setEdit(true);
    }
  }

  return (
    <div className="CommandTeam Item">
      <span className={ enabled ? 'enabled indicator' : 'indicator' } />
      <span className="number">{ data.number }</span>

      <CommandImage image={ data.image } config={ config } request={ request } id={ data.id }/>

      <span className="team">
        <span className="name" title={ data.name }>{ data.name }</span>
        <Icon>medal</Icon>
        <span className="points">{ points }</span>
        {
          edit ? <span className="paid">Bezahlt: <input type="checkbox" onChange={ handlePaid } checked={ data.paid === '1' }/></span>
               : <span className={ data.paid === '1' ? 'paid true' : 'paid false' } onClick={ handleEdit }>Bezahlt: </span>
        }
      </span>

      <div className="starters">
        { starters }
      </div>

      { disci }

    </div>
  )
}
