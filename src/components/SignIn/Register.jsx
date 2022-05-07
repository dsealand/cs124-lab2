import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirebase, isEmpty } from 'react-redux-firebase';
import constants from '../../constants'

function Register() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const firebase = useFirebase();
    const authError = useSelector(state => state.firebase.authError)

    function emailRegister() {
        return firebase.createUser({email, password})
    }
    
    return <div className="signUpForm">
        {!isEmpty(authError) && <p>{constants.REGISTER_ERROR_MESSAGES[authError.code]}</p>}
        <h1>Sign up</h1>
        <input type="text" id='email' value={email} placeholder="Email"
               onChange={e=>setEmail(e.target.value)}/>
        <br/>
        <input type="password" id='pw' value={password} placeholder="Password"
               onChange={e=>setPassword(e.target.value)}/>
        <br/>
        <button className="signButton" onClick={emailRegister}>
            Sign Up
        </button>

    </div>
}

export default Register;