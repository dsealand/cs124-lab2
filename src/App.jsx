import './App.css';
import React from 'react';
import { Header, Tab, ListContainer, Modal, Login, Register } from './components';
import { useState } from 'react';
import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";
import { useDispatch, useSelector } from 'react-redux';
import { useFirestore, useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { getSharedTabs, getAllTabs, getActiveTabID, getAuth } from './selectors';
import { setActiveTabID } from './activeSlice';
import { FaUser } from 'react-icons/fa';
import constants from './constants';

function App({ auth, ...props }) {
  const [modal, setModal] = useState({ show: false });
  const [shareModal, setShareModal] = useState(false);
  const [emailInput, seteEmailInput] = useState(null);
  const firestore = useFirestore();
  const dispatch = useDispatch();

  const tabs = getSharedTabs(auth.email);
  const activeTabID = getActiveTabID();

  if (!isLoaded(tabs)) {
    return <p>Loading</p>
  }

  if (isLoaded(tabs) && !activeTabID) {
    console.log(tabs)
    dispatch(setActiveTabID(Object.keys(tabs)[0]))
    return <p>Loading</p>
  }


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

  console.log('auth', isEmpty(auth))

  return (
    <div className="App">
      <div className="header">
        <Header
          setModal={setModal}
        ></Header>
      </div>
      <div className="content">
        <ListContainer />
        {modal.show &&
          <Modal {...modal}>
            {modal.children}
          </Modal>}
      </div>
      <div className="share-modal">
        {shareModal &&
          <div className={"backdrop"} onClick={(e) => { setShareModal(false) }}>
            <div className="modal">
              Enter email of user to share with:
              <input
                type='text'
                value={emailInput}
                onChange={e => seteEmailInput(e.target.value)}
                >
              </input>
              <div className="alert-buttons">
                <button
                  aria-label={'cancel share task list'}
                  className={"alert-button alert-cancel"}
                  type={"button"}
                  onClick={() => {
                    () => {
                      setShareModal(false)
                    };
                  }}>
                  Cancel sharing
                </button>
                <button
                  aria-label={'confirm share task list'}
                  className={"alert-button alert-ok"}
                  type={"button"}
                  onClick={() => {
                    () => {
                      setShareModal(false);
                      /* add email to task list usersSharedWith */
                    }
                  }}>
                  Confirm sharing
                </button>
              </div>
            </div>
          </div>}
      </div>
      <div className="footer">
        <ol className="tab-list">
          {Object.entries(tabs).map(([id, tab]) => {
            if (tab) {
              return <Tab
                key={id}
                id={id}
                label={tab.name}
                setModal={setModal}
              />
            }
          })}
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
        <div className="footer-user">
          <button className="user-icon" onClick={(e) => {
            setShareModal(true)
          }}>
            <FaUser />
          </button>
        </div>
      </div>
    </div >
  );
}

export default App;
