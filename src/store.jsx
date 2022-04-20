import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';


export default configureStore({
  reducer: {
    tasks: tasksReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer, // <- needed if using firestore
  }
});