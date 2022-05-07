import './App.css';
import React from 'react';
import { Header, Tab, ListContainer, Modal, Login, Register } from './components';
import { useState } from 'react';
import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";
import { useDispatch } from 'react-redux';
import { useFirestore, isLoaded, isEmpty } from 'react-redux-firebase';
import { getAllTabs, getActiveTabID, getAuth } from './selectors';
import { setActiveTabID } from './activeSlice'
import { FaUser } from 'react-icons/fa'

function App(props) {
  const [modal, setModal] = useState({ show: false })
  const firestore = useFirestore();
  const tabs = getAllTabs();
  const dispatch = useDispatch();
  const activeTabID = getActiveTabID();
  const auth = getAuth();

  if (!isLoaded(tabs)) {
    return <p>Loading</p>
  }

  if (isLoaded(tabs) && !activeTabID) {
    dispatch(setActiveTabID(Object.keys(tabs)[0]))
    return <p>Loading</p>
  }


  function handleBlur(e) {
    if (e.target.value !== "") {
      const created = new Date();
      const newDoc = firestore
        .collection("tabs-0")
        .doc()
      newDoc.set({
        name: e.target.value,
        created: created.toISOString(),
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
      {/* <div className="content">
        {!isEmpty(auth)?
          <>
            <ListContainer/>
            {modal.show && 
            <Modal {...modal}>
              {modal.children}
            </Modal>}
          </>:
          <div className="loginForm">
            <Login className="signIn"/>
            <Register className="signUp"/>
          </div>
        }
      </div> */}
      {isEmpty(auth) ? <div className="footer">
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
                if (e.key === 'Enter') {
                  e.target.blur()
                }
              }}
            />
          </li>
        </ol>
        <div className="icon-user">
          <button
            aria-label="sharing and user menu"
            className="icon-button"
            onClick={console.log('hello')}>
            <FaUser />
          </button>
        </div>
      </div> : ''}
    </div >
  );
}

export default App;
