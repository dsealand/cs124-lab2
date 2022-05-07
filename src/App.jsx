import './App.css';
import React from 'react';
import { Header, Tab, ListContainer, Modal } from './components';
import { useState } from 'react';

import { useDispatch } from 'react-redux';
import { useFirestore, isLoaded, isEmpty } from 'react-redux-firebase';
import { getSharedTabs, getAllTabs, getActiveTabID } from './selectors';
import { setActiveTabID } from './activeSlice';
import { FaUser } from 'react-icons/fa';
import constants from './constants';

function App({ auth, ...props }) {
  const [modal, setModal] = useState({ show: false });
  const [shareModal, setShareModal] = useState(false);
  const [emailInput, seteEmailInput] = useState("");
  const firestore = useFirestore();
  const dispatch = useDispatch();

  const tabs = getSharedTabs(auth.email);
  const activeTabID = getActiveTabID();

  if (!isLoaded(tabs)) {
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

  function handleShare(email) {
    console.log("email: ", email)
    if (!isEmpty(activeTabID)) {
      firestore
        .collection('tabs-0')
        .doc(activeTabID)
        .update(firestore.FieldValue.arrayUnion(email)
        )
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
        <ListContainer />
        {modal.show &&
          <Modal {...modal}>
            {modal.children}
          </Modal>}
      </div>
      <div>
        {shareModal &&
          <div className={"backdrop"} onClick={(e) => {
            setShareModal(false)
          }}>
            <div
              className="share-modal"
              onClick={e => e.stopPropagation()}>
              Enter email of user to share with:
              <input
                className='email-input'
                type='text'
                value={emailInput}
                onFocus={e => {
                  console.log('stopped propogation')
                  e.stopPropagation();
                }}
                onChange={e => {
                  seteEmailInput(e.target.value)
                }}
              >
              </input>
              <div className="alert-buttons">
                <button
                  aria-label={'cancel share task list'}
                  className={"alert-button alert-cancel"}
                  type={"button"}
                  onClick={() => { setShareModal(false) }}>
                  Cancel
                </button>
                <button
                  aria-label={'confirm share task list'}
                  className={"alert-button alert-ok-share"}
                  type={"button"}
                  onClick={
                    () => {
                      setShareModal(false);
                      handleShare(emailInput);
                    }
                  }>
                  Share
                </button>
              </div>
            </div>
          </div>}
      </div>
      <div className="footer">
        <ol className="tab-list">
          {!isEmpty(tabs) ? Object.entries(tabs).map(([id, tab]) => {
            if (tab) {
              return <Tab
                key={id}
                id={id}
                label={tab.name}
                setModal={setModal}
              />
            }
          }) : ''}
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
