import './App.scss';
import { useState, useEffect } from 'react';
import { sendRequest } from './backend.js';
import Login from './interfaces/Login.js';
import Admin from './interfaces/Admin.js';
import Command from './interfaces/Command.js';
import Referee from './interfaces/Referee.js';
import Starter from './interfaces/Starter.js';
import Photographer from './interfaces/Photographer.js';

function App(props) {
  const [ role, setRole ] = useState(props.role);
  const [ user, setUser ] = useState(props.user);
  const [ model, setModel ] = useState(props.model);
  const [ config, setConfig ] = useState(props.config);

  const request = (data) => {
    sendRequest(data, v => {
      if (typeof v.user_id !== 'undefined') {
        setUser({ id: v.user_id, name: v.user_name });
      }
      if (typeof v.model !== 'undefined') {
        setModel(v.model);
      }
      if (typeof v.role !== 'undefined') {
        setRole(v.role);
      }
      if (typeof v.config !== 'undefined') {
        setConfig(v.config);
      }
      if (data.callback) {
        data.callback(v);
      }
      // DEBUG remove!
      // if(v.error) alert(v.error);
    });
  }

  const [title, setTitle] = useState("");

  useEffect(() => {
    if (config)
      document.title = config.title;
  }, [ config ]);

  const changeTitle = (event) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    request({action: 'config'});
  }, [ ]);

  let element = <Login request={ request } user={ user } config={ config }/>;
  if (role === 'admin')
    element = <Admin request={ request } user={ user } model={ model } config={ config }/>;
  else if (role === 'command')
    element = <Command request={ request } user={ user } model={ model } config={ config }/>;
  else if (role === 'referee')
    element = <Referee request={ request } user={ user } model={ model } config={ config }/>;
  else if (role === 'starter')
    element = <Starter request={ request } user={ user } model={ model } config={ config }/>;
  else if (role === 'photographer')
    element = <Photographer request={ request } user={ user } model={ model } config={ config }/>;

  return (
    <div className="App">
      { element }
    </div>
  );
}

export default App;
