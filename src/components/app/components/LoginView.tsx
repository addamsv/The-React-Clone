import React from "react";

const LoginView = (props: { onLogin: () => void }) => {
  const { onLogin } = props;

  return (
    <div style={{display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '300px',
                width: '400px',
                margin: '150px auto',
                background: '#ddd',
                borderRadius: '5px',
                boxShadow: '0px 0px 15px #aaa'
              }}>
      <h1 style={{display: 'block', textAlign: 'center'}}>login</h1>
      <span>Login:</span>
      <input type='text' ></input>
      <span>Password:</span>
      <input type='password'></input>
      <div>
        <button>forget password</button>
        <button onClick={() => onLogin()}>login</button>
      </div>
    </div>
  );
}

export default LoginView;
