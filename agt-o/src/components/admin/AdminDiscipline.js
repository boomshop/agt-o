import './AdminDiscipline.scss';
import Icon from '../Icon.js';
import { useState } from 'react';

const types = {
  'points': 'Punkte',
  'seconds': 'Sekunden',
}
export default function AdminDiscipline(props) {
  const { mode, request } = props;

  const [ edit, setEdit ] = useState(false);

  const [ name, setName ] = useState(props.name);
  const [ description, setDescription ] = useState(props.description);
  const [ number, setNumber ] = useState(props.number);
  const [ type, setType ] = useState(props.type);
  const [ multiplier, setMultiplier ] = useState(props.multiplier);
  const [ faults, setFaults ] = useState(props.multiplier);

  function editMode(state) {
    if (state) {
      setName(props.name);
      setDescription(props.description);
      setNumber(props.number);
      setType(props.type);
      setMultiplier(props.multiplier);
      setFaults(props.faults);
    }
    setEdit(state);
  }

  function save() {
    const req = {
      action: mode === 'edit' ? 'editDiscipline' : 'addDiscipline',
    }
    if (mode === 'edit') { req.id = props.id; }

    if (description) { req.description = description; }
    if (name) { req.name = name; }
    if (number) { req.number = number; }
    if (type) { req.type = type; }
    if (multiplier) { req.multiplier = multiplier; }
    if (faults) { req.faults = faults; }

    request(req);
    setEdit(false);
  }

  function remove() {
    const conf = window.confirm('SICHER? Diese Aktion löscht die Disziplin #' + props.number + ' "' + props.name + '" aus der Datenbank.')
    if (conf) {
      request({
        action: 'removeDiscipline',
        id: props.id,
      });
      setEdit(false);
    }
  }

  function changeName(e) {
    const n = e.target.value;
    setName(n);
  }
  function changeDescription(e) {
    const n = e.target.value;
    setDescription(n);
  }
  function changeNumber(e) {
    const n = e.target.value;
    setNumber(n);
  }
  function changeMultiplier(e) {
    const n = e.target.value;
    setMultiplier(n);
  }
  function changeType(e) {
    const n = e.target.value;
    setType(n);
  }
  function changeFaults(e) {
    const n = e.target.value;
    setFaults(n);
  }


  const typeOptions = [<option value="0" key="noitem">Kein Typ</option>];
  Object.keys(types).map((v, i) => { typeOptions.push(<option value={ v } key={ 'item' + i }>{ types[v] }</option>); return null; });

  return (
    <div className={ "AdminDiscipline Item " + (edit ? 'edit' : '') } key={ 'item' + props.id }>
      {
        mode === 'edit' ? <span className="id">{ props.id }</span> : <i/>
      }

      <span className="label">Name</span>
      {
        edit || mode === 'add' ? <input type="text" value={ name } onChange={ changeName }/>
        : <span>{ props.name }</span>
      }

      <span className="label">Beschreibung</span>
      {
        edit || mode === 'add' ? <input type="text" value={ description } onChange={ changeDescription }/>
        : <span>{ props.description }</span>
      }

      <span className="label">Typ</span>
      {
        edit || mode === 'add' ? <select value={ type } onChange={ changeType }>{ typeOptions }</select>
        : <span>{ types[props.type] }</span>
      }

      <span className="label">Nummer</span>
      {
        edit || mode === 'add' ? <input type="text" value={ number } onChange={ changeNumber }/>
        : <span>{ props.number }</span>
      }

      <span className="label">Multiplikator</span>
      {
        edit || mode === 'add' ? <input type="text" value={ multiplier } onChange={ changeMultiplier }/>
        : <span>{ props.multiplier }</span>
      }

      <span className="label">Punkte pro Fehler</span>
      {
        edit || mode === 'add' ? <input type="text" value={ faults } onChange={ changeFaults }/>
        : <span>{ props.faults }</span>
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
