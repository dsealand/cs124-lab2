// import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

const tabsCollection = "tabs-0";
const tasksCollection = "tasks";
const sharedUsers = "sharedUsers";

export const getActiveTabID = () => {
  return useSelector(state => state.active.tab)
}

export const getSortOrder = () => {
  return useSelector(state => state.active.sortOrder)
}

export const getShowCompleted = () => {
  return useSelector(state => state.active.showCompleted)
}

// TODO: deal with ordering, orderBy in useFirestoreConnect
export const getTasksByTabID = (tabID, orderBy=["priority", "desc"]) => {
  const storeAs = tabID+tasksCollection;
  useFirestoreConnect([{ 
    collection: tabsCollection,
    doc: tabID,
    subcollections: [{ collection: tasksCollection}],
    storeAs,
    orderBy
  }]);

  return useSelector(state => state.firestore.ordered[storeAs])
}

export const getTabByID = (tabID) => {
  useFirestoreConnect([{
    collection: tabsCollection,
    doc: tabID
  }]);
  return useSelector(state => state.firestore.data[tabID]);
}

export const getSharedTabIDsByUserID = (userID) => {
  useFirestoreConnect([{ collection: tabsCollection,
    where: [[sharedUsers, "array-contains", userID]]
  }]);

  return useSelector(state => {
    const sharedTabs = Object.entries(state.firestore.data[tabsCollection]).filter(
      ([id,tab]) => tab.sharedUsers.contains(userID)
    );
    return sharedTabs.map(t => t[0]);
  });
}

export const getAllTabs = () => {
  useFirestoreConnect([{
    collection: tabsCollection,
  }]);

  return useSelector(state => (state.firestore.data[tabsCollection]));
}