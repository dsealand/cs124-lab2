import './App.css';
import React from 'react';
import Header from './Header';
import { Tab } from './Tab';
import ListContainer from './ListContainer';
import Modal from './Modal';
import { useState, useEffect } from 'react';
import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";
import { initializeApp } from "firebase/app";
import {
  collection, doc, getFirestore, query, orderBy, setDoc, updateDoc, deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDs9yo12K8YT79DyMVEguJ25hO0d9V-JwQ",
  authDomain: "cs124-lab3-d845a.firebaseapp.com",
  projectId: "cs124-lab3-d845a",
  storageBucket: "cs124-lab3-d845a.appspot.com",
  messagingSenderId: "204426368246",
  appId: "1:204426368246:web:c8c15574b455c27c0448d7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const tabCollectionName = "tabs-0";
const tabsCollection = collection(db, tabCollectionName);

function App(props) {
  const [isShowCompleted, setIsShowCompleted] = useState(true);
  const [sortOrder, setSortOrder] = useState("updated desc");
  const [activeTab, setActiveTab] = useState(0);
  const [modal, setModal] = useState({show: false})

  const tasksCollection = collection(db, `${tabCollectionName}/${activeTab}/tasks`);

  const [tabs, tabsLoading, tabsError] = useCollectionData(query(tabsCollection, orderBy("created")));
  const [tasks, tasksLoading, tasksError] = useCollectionData(query(tasksCollection, orderBy(...sortOrder.split(" "))));

  useEffect(() => {
    if (activeTab === 0 && !(tabsError || tabsLoading)) {
      setActiveTab(tabs[0].id);
      console.log(tabs);
    }
  });

  function handleToggleShowCompleted() {
    setIsShowCompleted(!isShowCompleted);
  }

  function handleDeleteCompleted() {
    const completedTasks = tasks.filter((t) => t.isCompleted)

    completedTasks.forEach((t) => {
      deleteDoc(doc(tasksCollection, t.id));
    });
  }

  function handleChangeField(id, field, value) {
    updateDoc(doc(tasksCollection, id),
        {
          [field]: value,
          updated: serverTimestamp()
        })
  }

  function handleToggleItemCompleted(id) {
    handleChangeField(id, "isCompleted", !tasks.find(t => t.id === id).isCompleted)
  }

  function handleAddNewTask(task) {
    const uniqueID = generateUniqueID();
    setDoc(doc(tasksCollection, uniqueID),
        {
          id: uniqueID,
          text: task,
          isCompleted: false,
          priority: 1,
          updated: serverTimestamp()
        });
    // console.log(activeTab)
  }

  function handleDeleteById(id) {
    deleteDoc(doc(tasksCollection, id));
  }

  function handleAddTab(tabName) {
    const uniqueID = generateUniqueID();
    setDoc(doc(tabsCollection, uniqueID),
        {
          id: uniqueID,
          name: tabName,
          created: serverTimestamp()
        });
  }

  function handleSelectTab(id) {
    setActiveTab(id);
    console.log('active tab', activeTab);
  }

  function handleBlur(e) {
    if (e.target.value !== "") {
      handleAddTab(e.target.value);
      console.log(e.target.value);
      document.getElementById("newTabInput").value = "";
    }
  }

  function handleDeleteTab(id) {
    deleteDoc(doc(tabsCollection, id));
    setActiveTab(tabs[0].id)
    console.log('active tab after delete:', activeTab)
  }


  if (tasksLoading || tabsLoading) return (<div></div>)
  if (tasksError) return (<div>{`Error: ${tasksError}`}</div>)
  if (tabsError) return (<div>{`Error: ${tabsError}`}</div>)


  return (
      <div className="App">
        <div className="header">
          <Header
              onToggleShowCompleted={handleToggleShowCompleted}
              setModal={setModal}
              onDeleteCompleted={handleDeleteCompleted}
              isShowCompleted={isShowCompleted}
              setSortOrder={setSortOrder}
              sortOrder={sortOrder}
          ></Header>
        </div>
        <div className="content">
          <ListContainer
              items={tasks.filter(t => !t.isCompleted || isShowCompleted)}
              onChangeField={handleChangeField}
              onToggleItemCompleted={handleToggleItemCompleted}
              onAddNewTask={handleAddNewTask}
              onDeleteById={handleDeleteById}
          />
          {modal.show &&
              <Modal {...modal}>
                {modal.children}
              </Modal>}
        </div>
        <div className="footer">
          <ol className="tab-list">
            {tabs.map(tab =>
                <Tab
                    key={tab.id}
                    id={tab.id}
                    activeTab={activeTab}
                    label={tab.name}
                    onClickTab={handleSelectTab}
                    deleteTab={handleDeleteTab}
                    setModal={setModal}/>)}
            <li className="new-tab">
              <input
                  className="new-tab-input"
                  id="newTabInput"
                  defaultValue=""
                  placeholder="New tab"
                  onBlur={handleBlur}
                  autocomplete="off"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
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
