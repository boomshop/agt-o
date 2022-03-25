import './AdminUser.scss';
import Icon from '../Icon.js';
import { useState } from 'react';

const roles = {
  'admin': 'Administrator',
  'starter': 'Teilnehmer',
  'referee': 'Schiedsrichter',
  'command': 'Kommando',
  'photographer': 'Fotograf',
}
export default function AdminUser(props) {
  const { mode, request } = props;

  const [ edit, setEdit ] = useState(false);

  const [ name, setName ] = useState(props.name);
  const [ role, setRole ] = useState(props.role);
  const [ login, setLogin ] = useState(props.login);
  const [ password, setPassword ] = useState('');

  function editMode(state) {
    if (state) {
      setName(props.name);
      setLogin(props.login);
      setRole(props.role);
      setPassword('');
    }
    setEdit(state);
  }

  function save() {
    const req = {
      action: mode === 'edit' ? 'editUser' : 'addUser',
      role: role,
    }
    if (mode === 'edit') { req.id = props.id; }

    if (password) { req.password = password; }
    if (name) { req.name = name; }
    if (login) { req.login = login; }
    request(req);
    setEdit(false);
  }

  function remove() {
    request({
      action: 'removeUser',
      id: props.id,
    });
    setEdit(false);
  }

  function changeName(e) {
    const n = e.target.value;
    setName(n);
  }
  function changeRole(e) {
    const n = e.target.value;
    setRole(n);
  }
  function changeLogin(e) {
    const n = e.target.value;
    setLogin(n);
  }
  function changePassword(e) {
    const n = e.target.value;
    setPassword(n);
  }

  function generatePassword() {
    setPassword(Math.random().toString(16).substr(2, 8));
  }

  const roleOptions = [<option value="0" key="noitem">Keine Rolle</option>];
  Object.keys(roles).map((v, i) => { roleOptions.push(<option value={ v } key={ 'item' + i }>{ roles[v] }</option>); return null; });

  return (
    <div className={ "AdminUser Item " + (edit ? 'edit' : '') } key={ 'item' + props.id }>
      {
        mode === 'edit' ? <span className="id">{ props.id }</span> : <i/>
      }

      <span className="label">Name</span>
      {
        edit || mode === 'add' ? <input type="text" value={ name } onChange={ changeName }/>
        : <span>{ props.name }</span>
      }

      <span className="label">Rolle</span>
      {
        ((edit || mode === 'add') && props.id !== '1') ? <select value={ role } onChange={ changeRole }>{ roleOptions }</select>
        : <span>{ roles[props.role] }</span>
      }

      <span className="label">Login</span>
      {
        edit || mode === 'add' ? <input type="text" value={ login } onChange={ changeLogin }/>
        : <span>{ props.login }</span>
      }

      {
        edit || mode === 'add' ? <>
          <span className="label">Passwort</span>
          <input type="text" value={ password } onChange={ changePassword }/>
        </> : <><i></i><i></i></>
      }

      <div className="buttons">
        {
          (mode === 'edit' && edit) || mode === 'add' ?
            <button onClick={ generatePassword }><Icon>passwordgenerator</Icon></button>
          : null
        }
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
