import './App.css';
import React from 'react';
import { Header, Tab, ListContainer, Modal } from './components';
import { useState } from 'react';
import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";
import { useFirestore, isLoaded } from 'react-redux-firebase';
import { getAllTabs } from './selectors';

function App(props) {
  const [modal, setModal] = useState({show: false})
  const firestore = useFirestore();
  const tabs = getAllTabs();

  if (!isLoaded(tabs)) {
    return <p>Loading</p>
  }

  // const tasksCollection = collection(db, `${tabCollectionName}/${activeTab}/tasks`);

  // const [tabs, tabsLoading, tabsError] = useCollectionData(query(tabsCollection, orderBy("created")));
  // const [tasks, tasksLoading, tasksError] = useCollectionData(query(tasksCollection, orderBy(...sortOrder.split(" "))));

  // useEffect(() => {
  //   if (activeTab === 0 && !(tabsError || tabsLoading)) {
  //     setActiveTab(tabs[0].id);
  //     console.log(tabs);
  //   }
  // });


  // function handleDeleteCompleted() {
  //   const completedTasks = tasks.filter((t) => t.isCompleted)

  //   completedTasks.forEach((t) => {
  //     deleteDoc(doc(tasksCollection, t.id));
  //   });
  // }

  // function handleChangeField(id, field, value) {
  //     updateDoc(doc(tasksCollection, id),
  //       {
  //         [field]: value,
  //         updated: serverTimestamp().toDate().toISOString()
  //       })
  //   }

  // function handleToggleItemCompleted(id) {
  //   handleChangeField(id, "isCompleted", !tasks.find(t => t.id === id).isCompleted)
  // }

  // function handleAddNewTask(task) {
  //   const uniqueID = generateUniqueID();
  //   setDoc(doc(tasksCollection, uniqueID),
  //     {
  //       id: uniqueID,
  //       text: task,
  //       isCompleted: false,
  //       priority: 1,
  //       updated: serverTimestamp()
  //     });
  //   // console.log(activeTab)
  // }

  // function handleDeleteById(id) {
  //   deleteDoc(doc(tasksCollection, id));
  // }

  // function handleAddTab(tabName) {
  //   const uniqueID = generateUniqueID();
  //   setDoc(doc(tabsCollection, uniqueID),
  //     {
  //       id: uniqueID,
  //       name: tabName,
  //       created: serverTimestamp()
  //     });
  // }

  // function handleSelectTab(id) {
  //   setActiveTab(id);
  //   console.log('active tab', activeTab);
  // }

  function handleBlur(e) {
    if (e.target.value !== "") {
      const uniqueID = generateUniqueID();
      const created = new Date();
      firestore
        .collection("tabs-0")
        .add({
          id: uniqueID,
          name: e.target.value,
          created: created.toISOString()
        })
      document.getElementById("newTabInput").value = "";
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
        <ListContainer
          // items={tasks.filter(t => !t.isCompleted || isShowCompleted)}
        />
        {modal.show && 
          <Modal {...modal}>
            {modal.children}
          </Modal>}
      </div>
      <div className="footer">
        <ol className="tab-list">
          {Object.entries(tabs).map(([id, tab]) =>
            <Tab
              key={id}
              id={id}
              label={tab.name}
              setModal={setModal}/>)}
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
    </div>
    </div >
  );
}

export default App;
