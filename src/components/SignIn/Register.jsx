import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirebase, isEmpty } from 'react-redux-firebase';


function Register() {
    // const [
    //     createUserWithEmailAndPassword,
    //     userCredential, loading, error
    // ] = useCreateUserWithEmailAndPassword(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const firebase = useFirebase();
    const auth = useSelector(state => state.firebase.auth);
    const authError = useSelector(state => state.firebase.authError)

    const errorCodes = {
      "auth/invalid-email": "This email address is not valid. Please try again.",
      "auth/internal-error": "An error occurred. Please try again.",
      "auth/user-not-found": "Incorrect email address or password.",
      "auth/wrong-password": "Incorrect email address or password."
    }

    function emailRegister() {
        return firebase.createUser({email, password})
    }

    // if (userCredential) {
    //     // Shouldn't happen because App should see that
    //     // we are signed in.
    //     return <div>Unexpectedly signed in already</div>
    // } else if (loading) {
    //     return <p>Signing up…</p>
    // }
    return <div className="signUpForm">
        {!isEmpty(authError) && <p>{errorCodes[authError.code]}</p>}
        <h1>Sign up</h1>
        <input type="text" id='email' value={email} placeholder="Email"
               onChange={e=>setEmail(e.target.value)}/>
        <br/>
        <input type="text" id='pw' value={password} placeholder="Password"
               onChange={e=>setPassword(e.target.value)}/>
        <br/>
        <button className="signButton" onClick={emailRegister}>
            Sign Up
        </button>

    </div>
}

export default Register;