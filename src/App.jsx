import './App.css';
import React from 'react';
import { Header, Tab, ListContainer, Modal } from './components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFirestore, isLoaded, isEmpty } from 'react-redux-firebase';
import { getSharedTabs, getAllTabs, getActiveTabID } from './selectors';
import { setActiveTabID } from './activeSlice'
import constants from './constants';

function App({auth, ...props}) {
  const [modal, setModal] = useState({show: false});
  const firestore = useFirestore();
  const dispatch = useDispatch();

  const tabs = getSharedTabs(auth.email);
  const activeTabID = getActiveTabID();

  if (!isLoaded(tabs)) {
    return <p>Loading</p>
  }

  // if (isLoaded(tabs)) {
  //   return <p>Loading</p>
  // }


  function handleBlur(e) {
    if (e.target.value !== "") {
      const created = new Date();
      const newDoc = firestore
        .collection(constants.TABS_COLLECTION)
        .doc()
      newDoc.set({
          owner: auth.email,
          name: e.target.value,
          created: created.toISOString(),
          sharedUsers: [auth.email]
        })
      document.getElementById("newTabInput").value = "";
      dispatch(setActiveTabID(newDoc.id));
    }
  }

  return (
    <div className="App">
      <div className="header">
        <Header
          setModal={setModal}
        ></Header>
      </div>
      <div className="content">
            <ListContainer/>
            {modal.show && 
            <Modal {...modal}>
              {modal.children}
            </Modal>}
      </div>
      <div className="footer">
        <ol className="tab-list">
          {!isEmpty(tabs)?Object.entries(tabs).map(([id, tab]) => {
            if (tab) {
              return <Tab
                key={id}
                id={id}
                label={tab.name}
                setModal={setModal}
              />
            }
          }):''}
          <li className="new-tab">
            <input
              className="new-tab-input"
              id="newTabInput"
              defaultValue=""
              placeholder="New tab"
              onBlur={handleBlur}
              autoComplete="off"
              onKeyPress={(e) => {
                if (constants.ARIA_KEYS.includes(e.key)) {
                  e.target.blur()
                }
              }}
            />
          </li>
        </ol>
      </div>
    </div >
  );
}

export default App;
