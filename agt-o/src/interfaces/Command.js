import './Command.scss';
import Logout from '../components/Logout.js';
import Refresh from '../components/Refresh.js';
import CommandTeam from '../components/CommandTeam.js';
import moment from 'moment';
import { useState } from 'react';

function canStart (teams) {
  for (let i = 0, m = teams.length; i < m; ++i ) {
    let start = true;
    const team = teams[i];
    if (team.paid !== '1')
      start = false;
    if (!team.image)
      start = false;
    for (let j = 0, n = team.starters.length; j < n; ++j ) {
      const starter = team.starters[j];
      if (starter.g263 !== '1' || starter.disclaimer !== '1')
        start = false;
    }
    if (start)
      return true;
  }
}
export default function Command(props) {
  const { request, model, config } = props;
  const [ certs, setCerts ] = useState(false);

  const entries = [];
  if (model.teams) {
    model.teams.map((v, i) => {
      entries.push(<CommandTeam data={ v } config={ config } disciplines={ model.disciplines } request={ request } key={ 'cteam' + v.number }/>);
      return null;
    });
  }

  function handleStart() {
    if (window.confirm('SICHER? Dies kann nicht rückgängig gemacht werden!')) {
      request({
        action: 'editConfig',
        started: parseInt(Date.now()),
      });
    }
  }

  function handleEnd() {
    request({
      action: 'editConfig',
      ended: parseInt(Date.now()),
    });
  }

  function handleReopen() {
    request({
      action: 'editConfig',
      ended: '',
    });
  }

  function handleCertificates() {
    setCerts(true);
  }

  let matchtext;
  let matchbutton;
  if (config.ended) {
    matchtext = "Der Wettkampf wurde " + moment(parseInt(config.ended)).format('HH:mm:ss DD.MM.YYYY') + " beendet."
    if (!certs) {
      matchbutton = (
        <>
          <button onClick={ handleReopen } className="reopen">Wieder eröffnen</button>
          <button onClick={ handleCertificates } className="certificates">Urkunden generieren</button>
        </>
      );
    }
  } else if(config.started) {
    matchtext = "Der Wettkampf wurde " + moment(parseInt(config.started)).format('HH:mm:ss DD.MM.YYYY') + " gestartet."
    matchbutton = <button onClick={ handleEnd } className="end">Wettkampf beenden</button>
  } else if (canStart(model.teams)) {
    matchtext = "Der Wettkampf hat noch nicht begonnen.";
    matchbutton = <button onClick={ handleStart } className="start">Wettkampf starten</button>
  } else {
    matchtext = <>Der Wettkampf kann nicht starten. <span className="red">Bitte zunächst zumindest ein Team startklar machen (alle Haken grün, Foto).</span></>;
    matchbutton = null;
  }

  return (
    <>
      <header>
        <div className="top">
          <Logout user={ props.user } onLogout={ v => request({ action: 'logout' }) }/>
          <Refresh onRefresh={ v => request({ action: 'data' }) } timeout="3" />
        </div>
        <div className="bottom">
          <div className="match">
            { matchtext }
            { matchbutton }
          </div>
          <h2>{ config.title }</h2>
        </div>
      </header>
      <div className="Command List">
        { entries }
      </div>
      { certs && <iframe src="https://agt-o.de/api.php?action=certificates" id="certificates" sandbox="allow-scripts allow-downloads"/> }
    </>
  );
}
