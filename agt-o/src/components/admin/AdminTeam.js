import './AdminTeam.scss';
import Icon from '../Icon.js';
import { useState } from 'react';

export default function AdminTeam(props) {
  const { mode, request } = props;

  const [ edit, setEdit ] = useState(false);

  const [ name, setName ] = useState(props.name);
  const [ image, setImage ] = useState(props.image);
  const [ number, setNumber ] = useState(props.number);
  const [ paid, setPaid ] = useState(props.paid);

  function editMode(state) {
    if (state) {
      setName(props.name);
      setImage(props.image);
      setNumber(props.number);
      setPaid(props.paid);
    }
    setEdit(state);
  }

  function save() {
    const req = {
      action: mode === 'edit' ? 'editTeam' : 'addTeam',
    }
    if (mode === 'edit') { req.id = props.id; }

    if (typeof image !== 'undefined') { req.image = image; }
    if (typeof name !== 'undefined') { req.name = name; }
    if (typeof number !== 'undefined') { req.number = number; }
    if (typeof paid !== 'undefined') { req.paid = paid; }
    request(req);
    setEdit(false);
  }

  function remove() {
    request({
      action: 'removeTeam',
      id: props.id,
    });
    setEdit(false);
  }

  function changeName(e) {
    const n = e.target.value;
    setName(n);
  }
  function changeImage(e) {
    const n = e.target.value;
    setImage(n);
  }
  function changeNumber(e) {
    const n = e.target.value;
    setNumber(n);
  }
  function changePaid(e) {
    const n = e.target.checked;
    setPaid(n ? '1' : '0');
  }

  return (
    <div className={ "AdminTeam Item " + (edit ? 'edit' : '') } key={ 'item' + props.id }>
      {
        mode === 'edit' ? <span className="id">{ props.id }</span> : <i/>
      }

      <span className="label">Name</span>
      {
        edit || mode === 'add' ? <input type="text" value={ name } onChange={ changeName }/>
        : <span>{ props.name }</span>
      }

      <span className="label">Bilddatei</span>
      {
        edit || mode === 'add' ? <input type="text" value={ image } onChange={ changeImage }/>
        : <span>{ props.image }</span>
      }

      <span className="label">Startnummer</span>
      {
        edit || mode === 'add' ? <input type="text" value={ number } onChange={ changeNumber }/>
        : <span>{ props.number }</span>
      }

      <span className="label">Bezahlt</span>
      {
        edit || mode === 'add' ? <input type="checkbox" checked={ paid === '1' } onChange={ changePaid } />
        : <span className={ props.paid === '1' ? 'true' : 'false' }/>
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
