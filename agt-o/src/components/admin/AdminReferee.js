import './AdminReferee.scss';
import Icon from '../Icon.js';
import { useState } from 'react';

export default function AdminReferee(props) {
  const { mode, request, disciplines, users } = props;

  const _users = users.filter((u) => u.role === 'referee');

  const [ edit, setEdit ] = useState(false);

  const [ user, setUser ] = useState(props.user);
  const [ discipline, setDiscipline ] = useState(props.discipline);

  function editMode(state) {
    if (state) {
      setUser(props.user);
      setDiscipline(props.discipline);
    }
    setEdit(state);
  }

  function save() {
    const req = {
      action: mode === 'edit' ? 'editReferee' : 'addReferee',
    }
    if (mode === 'edit') { req.id = props.id; }

    if (typeof user !== 'undefined') { req.user = user; }
    if (typeof discipline !== 'undefined') { req.discipline = discipline; }

    request(req);
    setEdit(false);
  }

  function remove() {
    const conf = window.confirm('SICHER? Diese Aktion entzieht "' + currentUser.name + '" den Schiedsrichterstatus für Disziplin #' + currentDiscipline.number + '.')
    if (conf) {
      request({
        action: 'removeReferee',
        id: props.id,
      });
      setEdit(false);
    }
  }

  function changeUser(e) {
    const n = e.target.value;
    setUser(n);
  }
  function changeDiscipline(e) {
    const n = e.target.value;
    setDiscipline(n);
  }

  const userOptions = [<option value="0" key="noitem">Kein Benutzer</option>];
  _users.map((v, i) => { userOptions.push(<option value={ v.id } key={ 'item' + v.id }>{ v.name }</option>); return null; });

  let currentUser;
  _users.map((v, i) => { if (v.id === props.user) currentUser = v; return null; });

  const disciplineOptions = [<option value="0" key="noitem">Keine Disziplin</option>];
  disciplines.map((v, i) => { disciplineOptions.push(<option value={ v.id } key={ 'item' + v.id }>{ v.name }</option>); return null; });

  let currentDiscipline;
  disciplines.map((v, i) => { if (v.id === props.discipline) currentDiscipline = v; return null; });

  return (
    <div className={ "AdminReferee Item " + (edit ? 'edit' : '') } key={ 'item' + props.id }>
      {
        mode === 'edit' ? <span className="id">{ props.id }</span> : <i/>
      }

      <span className="label">Benutzer</span>
      {
        edit || mode === 'add' ? <select value={ user || 0 } onChange={ changeUser }>{ userOptions }</select>
        : <span>{ currentUser ? currentUser.name : 'keiner' }</span>
      }

      <span className="label">Disziplin</span>
      {
        edit || mode === 'add' ? <select value={ discipline || 0 } onChange={ changeDiscipline }>{ disciplineOptions }</select>
        : <span>{ currentDiscipline ? currentDiscipline.name : 'keine' }</span>
      }

      <div className="buttons">
        {
          mode === 'edit' && edit ?
            <button onClick={ save }><Icon>save</Icon></button>
          : null
        }
        {
          mode === 'edit' && edit ?
            <button onClick={ remove }><Icon>delete</Icon></button>
          : null
        }
        {
          mode === 'add' ?
            <button onClick={ save }><Icon>add</Icon></button>
          : null
        }
        {
          mode === 'edit' && !edit ?
            <button onClick={ () => editMode(true) }><Icon>edit</Icon></button>
          : null
        }
        {
          mode === 'edit' && edit ?
            <button className="cancel" onClick={ () => editMode(false) }><Icon>cancel</Icon></button>
          : null
        }
      </div>
    </div>
  )
}
