import './App.css';
import React from 'react';
import Header from './Header';
import ListContainer from './ListContainer';
import { useState, useEffect, useRef } from 'react';
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {initializeApp} from "firebase/app";
import {collection, doc, getFirestore, query, setDoc, onSnapshot, deleteDoc, 
  serverTimestamp} from "firebase/firestore";


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

const collectionName = "tasks-0";
const tasksCollection = collection(db, collectionName);

function DeleteDialog(props) {
  return <div className={"backdrop"}>
    <div className="modal">
      Delete all completed items?
      <div className="alert-buttons">
        <button className={"alert-button alert-cancel"} type={"button"}
                onClick={() => props.onClose()}>
          No
        </button>
        <button className={"alert-button alert-ok"} type={"button"}
                onClick={() => {
                  props.onOK();
                  props.onClose();
                }}>
          Delete
        </button>
      </div>
    </div>
  </div>
}

function App(props) {
  const [isShowCompleted, setIsShowCompleted] = useState(true);
  const [tasks, _setTasks] = useState([]);
  const [isShowDeleteDialog, setShowDeleteDialog] = useState(false);
  const [_sortField, setSortField] = useState("updated");

  const sortField = useRef({});
  sortField.current = _sortField;


  function setTasks(arr) {
    let sorted = arr.sort((a, b) => b[sortField.current] >= a[sortField.current] ? 1 : -1);
    if (sortField.current === "text") {sorted.reverse();}
    _setTasks((prev) => [...sorted]);
    console.log("sorting by", sortField.current)
  }

  useEffect(() => {
    console.log("sort field updated to", sortField.current)
    setTasks(tasks);
  }, [_sortField])

  // query initial tasks
  const q = query(tasksCollection);

  // subscribe to changes in firestore collection
  useEffect(() => { 
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = querySnapshot.docs.map(doc => doc.data());

      // on update to collection, update tasks state
      setTasks(temp);
    });
    return () => unsubscribe();
  }, []);

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
    setDoc(doc(db, collectionName, id),
    {
      [field]: value,
      updated: serverTimestamp()
    }, {merge: true})
  }

  function handleToggleItemCompleted(id) {
    handleChangeField(id, "isCompleted", !tasks.find(t => t.id === id).isCompleted)
  }

  function handleAddNewTask(task) {
    const uniqueID = generateUniqueID();
    setDoc(doc(db, collectionName, uniqueID),
    {
      id: uniqueID,
      text: task,
      isCompleted: false,
      priority: 0,
      updated: serverTimestamp()
    })
  }

  function toggleModal() {
    setShowDeleteDialog(!isShowDeleteDialog)  
  }

  function handleDeleteById(id) {
    deleteDoc(doc(tasksCollection, id));
  }

  return (
    <div className="App">
      <Header
        onToggleShowCompleted={handleToggleShowCompleted}
        onToggleModal={toggleModal}
        onDeleteCompleted={handleDeleteCompleted}
        isShowCompleted={isShowCompleted}
        setSortField={setSortField}
      ></Header>
      <ListContainer
        items={tasks.filter(t => !t.isCompleted || isShowCompleted)}
        onChangeField={handleChangeField}
        onToggleItemCompleted={handleToggleItemCompleted}
        onAddNewTask={handleAddNewTask}
        onDeleteById={handleDeleteById}
      />
        {isShowDeleteDialog && <DeleteDialog onClose={toggleModal} onOK={handleDeleteCompleted}/>}
    </div>
  );
}

export default App;
