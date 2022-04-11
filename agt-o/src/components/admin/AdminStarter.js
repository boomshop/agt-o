import './AdminStarter.scss';
import Icon from '../Icon.js';
import { useState } from 'react';
import DatePicker from 'react-date-picker';

function zeros(v) {
  return v < 10 ? '0' + v : v;
}
function displayBirthday(v) {
  const D = new Date(parseInt(v));
  return zeros(D.getDate()) + '.' + zeros((D.getMonth() + 1)) + '.' + D.getFullYear();
}

export default function AdminStarter(props) {
  const { mode, request, teams, users } = props;

  const _users = users.filter((u) => u.role === 'starter');

  const [ edit, setEdit ] = useState(false);

  const [ user, setUser ] = useState(props.user);
  const [ team, setTeam ] = useState(props.team);
  const [ disclaimer, setDisclaimer ] = useState(props.disclaimer);
  const [ g263, setG263 ] = useState(props.g263);
  const [ birthday, setBirthday ] = useState(new Date(parseInt(props.birthday)));

  function editMode(state) {
    if (state) {
      setUser(props.user);
      setTeam(props.team);
      setDisclaimer(props.disclaimer);
      setG263(props.g263);
      setBirthday(new Date(parseInt(props.birthday)));
    }
    setEdit(state);
  }

  function save() {
    const req = {
      action: mode === 'edit' ? 'editStarter' : 'addStarter',
    }
    if (mode === 'edit') { req.id = props.id; }

    if (typeof user !== 'undefined') { req.user = user; }
    if (typeof team !== 'undefined') { req.team = team; }
    if (typeof disclaimer !== 'undefined') { req.disclaimer = disclaimer; }
    if (typeof g263 !== 'undefined') { req.g263 = g263; }
    if (typeof birthday !== 'undefined') { req.birthday = birthday.valueOf(); }

    request(req);
    setEdit(false);
  }

  const userOptions = [<option value="0" key="noitem">Kein Benutzer</option>];
  _users.map((v, i) => { userOptions.push(<option value={ v.id } key={ 'item' + v.id }>{ v.name }</option>); return null; });

  let currentUser;
  _users.map((v, i) => { if (v.id === props.user) currentUser = v; return null; });

  function remove() {
    const name = currentUser ? currentUser.name : '[Unbekannter Benutzer]';
    const conf = window.confirm('SICHER? Diese Aktion entzieht "' + name + '" den Teilnehmerstatus.');
    if (conf) {
      request({
        action: 'removeStarter',
        id: props.id,
      });
      setEdit(false);
    }
  }

  function changeUser(e) {
    const n = e.target.value;
    setUser(n);
  }
  function changeTeam(e) {
    const n = e.target.value;
    setTeam(n);
  }
  function changeDisclaimer(e) {
    const n = e.target.checked;
    setDisclaimer(n ? '1' : '0');
  }
  function changeG263(e) {
    const n = e.target.checked;
    setG263(n ? '1' : '0');
  }
  function changeBirthday(e) {
    setBirthday(e);
  }

  const teamOptions = [<option value="0" key="noitem">Kein Team</option>];
  teams.map((v, i) => { teamOptions.push(<option value={ v.id } key={ 'item' + v.id }>{ v.name }</option>); return null; });

  let currentTeam;
  teams.map((v, i) => { if (v.id === props.team) currentTeam = v; return null; });

  return (
    <div className={ "AdminStarter Item " + (edit ? 'edit' : '') } key={ 'item' + props.id }>
      {
        mode === 'edit' ? <span className="id">{ props.id }</span> : <i/>
      }

      <span className="label">Benutzer</span>
      {
        edit || mode === 'add' ? <select value={ user || 0 } onChange={ changeUser }>{ userOptions }</select>
        : <span>{ currentUser ? currentUser.name : 'keiner' }</span>
      }

      <span className="label">Team</span>
      {
        edit || mode === 'add' ? <select value={ team || 0 } onChange={ changeTeam }>{ teamOptions }</select>
        : <span>{ currentTeam ? currentTeam.name : 'keins' }</span>
      }

      <span className="label">Geburtstag</span>
      {
        edit || mode === 'add' ? <DatePicker onChange={ changeBirthday } value={ birthday } showLeadingZeros={ true }/>
        : <span>{ displayBirthday(props.birthday) }</span>
      }

      <span className="label">G26-3</span>
      {
        edit || mode === 'add' ? <input type="checkbox" checked={ g263 === '1' } onChange={ changeG263 } />
        : <span className={ props.g263 === '1' ? 'true' : 'false' }/>
      }

      <span className="label">Disclaimer</span>
      {
        edit || mode === 'add' ? <input type="checkbox" checked={ disclaimer === '1' } onChange={ changeDisclaimer } />
        : <span className={ props.disclaimer === '1' ? 'true' : 'false' }/>
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
