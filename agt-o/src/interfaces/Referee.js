import './Referee.scss';
import Logout from '../components/Logout.js';
import Icon from '../components/Icon.js';
import State from '../components/State.js';
import Refresh from '../components/Refresh.js';
import Navigation from '../components/Navigation.js';
import RefereeTeam from '../components/RefereeTeam.js';
import Stopwatch from '../components/Stopwatch.js';
import Points from '../components/Points.js';
import { useState } from 'react';
import Blocker from '../components/Blocker.js';

export default function Referee(props) {
  const { request, model, config } = props;
  const disciplines = model.disciplines;

  const [ nav, setNav ] = useState();
  let [ edit, setEdit ] = useState();
  const [ penalty, setPenalty ] = useState(0);
  const [ reason, setReason ] = useState('');

  const navigation = [];
  const entries = [];
  let discipline;

  let nonav = true;
  if (disciplines.length) {
    disciplines.map((v, i) => {
      navigation.push({
        name: 'S' + v.number,
        value: v.number,
      });
      if (typeof nav === 'undefined') {
        setNav(v.number);
        discipline = v;
      }
      if (v.number === nav)
        discipline = v;
      return null;
    });
  }
  if (discipline) {
    discipline.teams.map((v, i) => {
      entries.push(<RefereeTeam data={ v } user={ props.user } discipline={ discipline } onEdit={ onEdit } key={ 'team' + i }/>);
      if (edit && edit.id === v.id ) {
        edit = v;
      }
      return null;
    });
  }
  navigation.push({
    icon: 'map',
    value: 'map',
  });

  function onEdit(data) {
    setEdit(data);
    setPenalty(data.penalty || 0);
    setReason(data.reason || '');
  }

  function switchState(state) {
    request({
      action: 'editProgress',
      team: edit.id,
      discipline: discipline.id,
      state: state,
    });
  }

  function onStopwatch(time) {
    request({
      action: 'editValuation',
      team: edit.id,
      discipline: discipline.id,
      points: time,
    });
  }

  function changePenalty(e) {
    setPenalty(parseFloat(e.target.value) || 0);
  }
  function changeReason(e) {
    setReason(e.target.value);
  }
  function handlePenalty() {
    request({
      action: 'editValuation',
      team: edit.id,
      discipline: discipline.id,
      penalty: penalty,
      reason: reason,
      points: edit.points || 0,
    });
  }

  function onPoints(points) {
    request({
      action: 'editValuation',
      team: edit.id,
      discipline: discipline.id,
      points: points || 0,
    });
  }

  const Map = props.config ? <iframe title="map" src={ props.config.map } /> : null;

  return (
    <>
      <header>
        <div className="top">
          <Navigation entries={ navigation } active={ nav } onSwitch={ (v) => { setEdit(false); setNav(v); } }/>
          <Logout user={ props.user } onLogout={ v => request({ action: 'logout' }) }/>
          <Refresh onRefresh={ v => request({ action: 'data' }) } timeout="10" />
        </div>
        {
          discipline && nav !== 'map' ?
          <div className="bottom">
            <h2>{ '(S' + discipline.number + ') ' + discipline.name + '' }</h2>
          </div>
          : null
        }
      </header>
      <div className="Referee">
        {
          nav === 'map' ? Map :
            <>
              <Blocker config={ config } />
              <div className="List">
              { entries }
              </div>
              {
                edit ?
                <div className="Edit">

                  <button className="close" onClick={ () => setEdit(null) }><Icon>close</Icon></button>

                  <span className="title">
                  <span className="number">{ edit.number }</span>
                  <span className="name">{ edit.name }</span>
                  </span>

                  {
                    discipline.type === 'seconds' ? <>
                    <Stopwatch onSet={ onStopwatch } />
                    </> :
                    <>
                    <Points onSet={ onPoints } value={ edit.points } />
                    </>
                  }
                  <div className="penalty">
                  <span className="plabel">Strafe</span>
                  <input onChange={ changePenalty } type="number" value={ penalty } className="penalty" size="1" />
                  <span className="rlabel">Grund</span>
                  <input onChange={ changeReason } type="text" value={ reason } className="reason" size="1" />
                  <button className='set' onClick={ handlePenalty }>Setzen</button>
                  </div>
                  <State onSwitch={ switchState } value={ edit.state }/>
                </div> : null
              }
            </>
        }
      </div>
    </>
  );
}
