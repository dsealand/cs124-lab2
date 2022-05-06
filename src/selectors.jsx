// import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import { setActiveTab, setActiveSortOrder } from './activeSlice';

const tabsCollection = "tabs-0";
const tasksCollection = "tasks";
const sharedUsers = "sharedUsers";
// const dispatch = useDispatch();


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
export const getTasksByTabID = (tabID, orderBy=["priority", "desc"], showCompleted=true) => {
  const storeAs = tabID+tasksCollection;
  useDispatch()(setActiveTab(tabID));
  useDispatch()(setActiveSortOrder(orderBy))
  useFirestoreConnect([{ 
    collection: tabsCollection,
    doc: tabID,
    subcollections: [{ collection: tasksCollection}],
    storeAs,
    orderBy
  }]);

  return useSelector(state => state.firestore.data[storeAs])
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

export const getAllTabIDs = () => {
  useFirestoreConnect([{
    collection: tabsCollection,
  }]);

  return useSelector(state => (Object.keys(state.firestore.data[tabsCollection])));
}