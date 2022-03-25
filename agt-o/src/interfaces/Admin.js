import './Admin.scss';
import Logout from '../components/Logout.js';
import Refresh from '../components/Refresh.js';
import Navigation from '../components/Navigation.js';

import AdminUser from '../components/admin/AdminUser.js';
import AdminStarter from '../components/admin/AdminStarter.js';
import AdminTeam from '../components/admin/AdminTeam.js';
import AdminReferee from '../components/admin/AdminReferee.js';
import AdminDiscipline from '../components/admin/AdminDiscipline.js';

import { useState } from 'react';
import React from 'react';

export default function Admin(props) {
  const { request } = props;
  const [ nav, setNav ] = useState('users');

  const entries = [];
  let data;
  let element;
  let add = {};
  let addItem;
  let header;

  switch(nav) {
    default:
      break;
    case 'users':
      data = props.model.users;
      element = AdminUser;
      addItem = <AdminUser name="Neuer Benutzer" login="Login" mode="add" request={ request }/>
      header = 'Benutzer';
      break;
    case 'teams':
      data = props.model.teams;
      element = AdminTeam;
      header = 'Teams';
      addItem = <AdminTeam name="Neues Team" number="" paid="0" image="" mode="add" request={ request } />
      break;
    case 'referees':
      data = props.model.referees;
      element = AdminReferee;
      add = {
        'disciplines': props.model.disciplines,
        'users': props.model.users,
      }
      header = 'Schiedsrichter';
      addItem = <AdminReferee user="0" discipline="0" users={ props.model.users } disciplines={ props.model.disciplines } mode="add" request={ request } />
      break;
    case 'starters':
      data = props.model.starters;
      element = AdminStarter;
      add = {
        'teams': props.model.teams,
        'users': props.model.users,
      }
      addItem = <AdminStarter user="0" users={ props.model.users } teams={ props.model.teams } request={ request } mode="add" g263="0" birthday="0" disclaimer="0"/>
      header = 'Teilnehmer';
      break;
    case 'disciplines':
      data = props.model.disciplines;
      element = AdminDiscipline;
      addItem = <AdminDiscipline name="Neue Disziplin" number="" multiplier="1" description="Beschreibung" type="points" mode="add" request={ request }/>
      header = 'Disziplinen';
      break;
  }

  if (data)
    data.map((v, i) => entries.push(React.createElement(element, { ...v, ...add, key: 'entry' + i, request: request, mode: 'edit' })));

  function handleReset(e) {
    const conf = window.confirm('SICHER? Diese Aktion löscht ALLE Daten aus der Datenbank und setzt Login und Passwort des Administrators auf "admin" zurück.')
    if (conf) {
      request({
        action: 'fullReset',
      });
    }
  }

  return (
    <>
      <header>
        <div className="top">
          <Navigation entries={ [
            {name: 'Benutzer', icon: 'user', value: 'users'},
            {name: 'Disziplinen', icon: 'discipline', value: 'disciplines'},
            {name: 'Teams', icon: 'team', value: 'teams'},
            {name: 'Teilnehmer', icon: 'starter', value: 'starters'},
            {name: 'Schiedsrichter', icon: 'referee', value: 'referees'},
          ] } active={ nav } onSwitch={ setNav }/>
          <button onClick={ handleReset } className="reset">RESET</button>
          <Logout user={ props.user } onLogout={ v => request({ action: 'logout' }) }/>
          <Refresh onRefresh={ v => request({ action: 'data' }) } timeout="10" />
        </div>
        <div className="bottom">
          { addItem }
        </div>
      </header>
      <h1>{ header }</h1>
      <div className="Admin List">
        { entries }
      </div>
    </>
  );
}
