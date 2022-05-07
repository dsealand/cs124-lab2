import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirebase, isEmpty } from 'react-redux-firebase';
import constants from '../../constants'


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const firebase = useFirebase();
    const authError = useSelector(state => state.firebase.authError);

    function emailLogin() {
      return firebase.login({
        email,
        password
      }).catch((err) => console.log(err))
    }

    function googleLogin() {
      return firebase.login({
        provider: 'google',
        type: 'redirect'
      }).catch((err) => console.log(err))
    }

    return <div className="signInForm">
        <h1>Sign in</h1>
        {!isEmpty(authError) && <p>{constants.LOGIN_ERROR_MESSAGES[authError.code]}</p>}
        <input type="text" id='email' value={email} placeholder="Email"
               onChange={e=>setEmail(e.target.value)}/>
        <br/>
        <input type="password" id='pw' value={password} placeholder="Password"
               onChange={e=>setPassword(e.target.value)}/>
        <br/>
        <button className="signButton" onClick={emailLogin}>
            Sign in
        </button>
        <button className="signButton" onClick={googleLogin}>
            Sign in with Google
        </button>
    </div>
}

export default Login;