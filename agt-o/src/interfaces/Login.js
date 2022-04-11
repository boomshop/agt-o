import './Login.scss';
import { useRef, useState } from 'react';

export default function Login(props) {

  const [ failed, setFailed ] = useState(false);
  const login = useRef();
  const password = useRef();

  function onSubmit(e) {
    setFailed(false);
    props.request({
      action: 'login',
      login: login.current.value,
      password: password.current.value,
      callback: v => {
        if (v.error) {
          setFailed(true);
        } else {
          setFailed(false);
        }
      },
    });
  }

  function onKeyDown(e) {
    if (e.code === 'Enter')
      onSubmit();
  }

  return (
    <>
      <header>
        <div className="top"><h2>{ (props.config) ? props.config.title : '' }</h2></div>
      </header>
      <div className="Login">

        {
          failed ? <span className="warning">Login fehlgeschlagen</span> : null
        }
        <span>Login</span>
        <input type="text" ref={ login } size="10" onKeyDown={ onKeyDown } />
        <span>Password</span>
        <input type="password" ref={ password } size="10" onKeyDown={ onKeyDown } />
        <button onClick={ onSubmit } className="submit">Login</button>
      </div>
    </>
  );
}
