import React from 'react';
import { getAuth } from './selectors';
import { isLoaded, isEmpty, useFirebase } from 'react-redux-firebase';
import App from './App'
import { LandingPage } from './components'

function AuthWrapper() {
  const auth = getAuth();
  // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  if (!isLoaded(auth)) {
    return <p>Loading</p>
  }
  if (!isEmpty(auth)) {
    return <App auth={auth}/>
  }
  else {
    return <LandingPage/>
  }
}
export default AuthWrapper;