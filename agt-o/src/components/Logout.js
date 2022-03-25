import './Logout.scss';
import Icon from './Icon.js';

export default function Logout(props) {

  return (
    <button className="Logout" onClick={ props.onLogout }><span>{ props.user.name }</span><Icon>logout</Icon></button>
  )
}
