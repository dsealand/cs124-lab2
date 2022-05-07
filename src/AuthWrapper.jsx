import React from 'react';
import { getAuth } from './selectors';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import App from './App'



function AuthWrapper() {
  const auth = getAuth();

  if (isLoaded(auth)) {
    console.log(auth)
    return <App auth={auth}/>
  }
  else {
    return <p>Loading</p>
  }
}
export default AuthWrapper