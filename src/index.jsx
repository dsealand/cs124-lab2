import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';

// In order to use react-redux-firebase, we have to use v9 compat syntax
// https://github.com/prescottprue/react-redux-firebase/issues/1145
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; 
import { firebaseReducer, ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore';
import { configureStore } from '@reduxjs/toolkit';

import activeReducer from './activeSlice';
import TestComponent from './TestComponent';
import App from './App';
import AuthWrapper from './AuthWrapper';

const store = configureStore({
  reducer: {
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    //TODO: name this reducer(?) lmao
    active: activeReducer
  }
});

const firebaseConfig = {
  apiKey: "AIzaSyDs9yo12K8YT79DyMVEguJ25hO0d9V-JwQ",
  authDomain: "cs124-lab3-d845a.firebaseapp.com",
  projectId: "cs124-lab3-d845a",
  storageBucket: "cs124-lab3-d845a.appspot.com",
  messagingSenderId: "204426368246",
  appId: "1:204426368246:web:c8c15574b455c27c0448d7"
};

// Initialize firebase instance and firestore.
// In order to use react-redux-firebase, we have to use v9 compat syntax
// https://github.com/prescottprue/react-redux-firebase/issues/1145
firebase.initializeApp(firebaseConfig);
firebase.firestore();


// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
}

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
}

ReactDOM.render(
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <AuthWrapper/>
      </ReactReduxFirebaseProvider>
    </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
