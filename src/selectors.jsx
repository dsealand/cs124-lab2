import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

const collection = "tabs-0"

export const getTasksByTabId = (id) => {
  useFirestoreConnect([
    { collection: "tabs-0",
      doc: id,
      subcollections: [{ collection: 'tasks'}],
      storeAs: `${id}-tasks`
    }
  ]);
  return useSelector(state => state.firestore.data[`${id}-tasks`])
}