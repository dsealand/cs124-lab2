import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import constants from './constants'

const tabsCollection = constants.TABS_COLLECTION;
const tasksCollection = constants.TASKS_COLLECTION;
const sharedUsers = constants.SHARED_USERS;

export const getActiveTabID = () => {
  return useSelector(state => state.active.tab)
}

export const getSortOrder = () => {
  return useSelector(state => state.active.sortOrder)
}

export const getShowCompleted = () => {
  return useSelector(state => state.active.showCompleted)
}

export const getAuth = () => {
  return useSelector(state => state.firebase.auth)
}

// TODO: deal with ordering, orderBy in useFirestoreConnect
export const getTasksByTabID = (tabID, orderBy=["priority", "desc"]) => {
  tabID = tabID || '_';
  const storeAs = tabID+tasksCollection;
  try {
    useFirestoreConnect([{ 
      collection: tabsCollection,
      doc: tabID,
      subcollections: [{ collection: tasksCollection}],
      storeAs,
      orderBy
    }]);
  }
  catch (e) {
    console.log("err",e)
  }

  return useSelector(state => state.firestore.ordered[storeAs])
}

export const getTabByID = (tabID) => {
  useFirestoreConnect([{
    collection: tabsCollection,
    doc: tabID
  }]);
  return useSelector(state => state.firestore.data[tabID]);
}

export const getSharedTabs = (email) => {
  useFirestoreConnect(function(){
    if (email) return [{ 
      collection: tabsCollection,
      where: [sharedUsers, "array-contains", email]
    }]
    else return null
  });

  return useSelector(state => (state.firestore.data[tabsCollection]));

  // return useSelector(state => {
  //   if (!(state.firestore.data[tabsCollection])) return [];
  //   const sharedTabs = Object.entries(state.firestore.data[tabsCollection]).filter(
  //     ([id,tab]) => tab.sharedUsers.contains(auth.email)
  //   );
  //   return sharedTabs.map(t => t[0]);
  // });
}

export const getAllTabs = () => {
  useFirestoreConnect([{
    collection: tabsCollection,
  }]);

  return useSelector(state => (state.firestore.data[tabsCollection]));
}