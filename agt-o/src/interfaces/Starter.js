import './Starter.scss';
import { useState } from 'react';
import Logout from '../components/Logout.js';
import Refresh from '../components/Refresh.js';
import Progress from '../components/Progress.js';
import StarterDiscipline from '../components/StarterDiscipline.js';
import Navigation from '../components/Navigation.js';
import Blocker from '../components/Blocker.js';

export default function Starter(props) {
  const { request, config } = props;
  const [ nav, setNav ] = useState('disciplines');

  const disciplines = [];
  if (props.model.disciplines) {
    props.model.disciplines.map((v, i) => {
        disciplines.push(<StarterDiscipline data={ v } key={ 'item' + i }/>);
      return null;
    });
  }

  const Map = props.config ?  <iframe title="map" src={ props.config.map } /> : null;

  return (
    <>
      <header>
        <div className="top">
          <Navigation entries={ [
            {name: '', icon: 'stopwatch', value: 'disciplines'},
            {name: '', icon: 'map', value: 'map'},
          ] } active={ nav } onSwitch={ setNav }/>
          <Logout user={ props.user } onLogout={ v => request({ action: 'logout' }) }/>
          <Refresh onRefresh={ v => request({ action: 'data' }) } timeout="10" />
        </div>
        <div className="bottom">
          <h2>{ props.model.team ? props.model.team.name : '(Kein Team zugewiesen)' }</h2>
        </div>
      </header>
      <div className="Starter">
        {
          nav === 'disciplines' && props.model.disciplines ? <>
            <Blocker config={ config } />
            <Progress data={ props.model.disciplines } config={ config }/>

            <div className="List">
              { disciplines }
            </div>
          </> : Map
        }
      </div>
    </>
  );
}
