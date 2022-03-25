import './CommandStarter.scss';
import moment from 'moment';
import Icon from './Icon.js';
import { useState } from 'react';

export default function CommandStarter(props) {
  const { data, request } = props;
  const [ edit, setEdit ] = useState(false);

  function handleDisclaimer(e) {
    request({
      action: 'editStarter',
      id: data.id,
      disclaimer: e.target.checked ? '1' : '0',
    });
  }
  function handleG263(e) {
    request({
      action: 'editStarter',
      id: data.id,
      g263: e.target.checked ? '1' : '0',
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
    <div className="CommandStarter">
      <span className="starter">
        <span className="name">{ data.name }</span>
        <Icon>birthday</Icon>
        <span className="birthday">{ moment(parseInt(data.birthday)).format('DD.MM.YYYY') }</span>
      </span>
      <span className="meta">
      {
        edit ? <span className="paid">Haftungsausschluss: <input type="checkbox" onChange={ handleDisclaimer } checked={ data.disclaimer === '1' }/></span>
             : <span className={ data.disclaimer === '1' ? 'disclaimer true' : 'disclaimer false'} onClick={ handleEdit }>Haftungsausschluss: </span>
      }
      {
        edit ? <span className="paid">G26-3: <input type="checkbox" onChange={ handleG263 } checked={ data.g263 === '1' }/></span>
             : <span className={ data.g263 === '1' ? 'g263 true' : 'g263 false'} onClick={ handleEdit }>G26-3: </span>
      }



      </span>
    </div>
  )
}
