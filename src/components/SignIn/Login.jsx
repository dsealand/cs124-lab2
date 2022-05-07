import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirebase, isEmpty } from 'react-redux-firebase';
import constants from '../../constants'


function Login() {
    // const [signInWithEmailAndPassword, user1, loading1, error1] = useSignInWithEmailAndPassword(auth);
    // const [signInWithGoogle, user2, loading2, error2] = useSignInWithGoogle(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const firebase = useFirebase();
    const auth = useSelector(state => state.firebase.auth);
    const authError = useSelector(state => state.firebase.authError);

    function emailLogin() {
      return firebase.login({
        email,
        password
      })
    }

    function googleLogin() {
      return firebase.login({
        provider: 'google',
        type: 'popup'
      })
    }

    return <div className="signInForm">
        <h1>Sign in</h1>
        {!isEmpty(authError) && <p>{constants.ERROR_MESSAGES[authError.code]}</p>}
        <input type="text" id='email' value={email} placeholder="Email"
               onChange={e=>setEmail(e.target.value)}/>
        <br/>
        <input type="text" id='pw' value={password} placeholder="Password"
               onChange={e=>setPassword(e.target.value)}/>
        <br/>
        <button className="signButton" onClick={emailLogin}>
            Sign in with Email
        </button>
        <button className="signButton" onClick={googleLogin}>
            Sign in with Google
        </button>
    </div>
}

export default Login;