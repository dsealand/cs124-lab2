import './App.css';
import React from 'react';
import Header from './Header';
import ListContainer from './ListContainer';
import { useState, useEffect } from 'react';
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {initializeApp} from "firebase/app";
import {collection, doc, getFirestore, query, setDoc, onSnapshot, getDocs, deleteDoc, where} from "firebase/firestore";


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
  const [isShowCompleted, setIsShowCompleted] = useState(true)
  const [tasks, setTasks] = useState([])
  const [isShowDeleteDialog, setShowDeleteDialog] = useState(false);

  // query initial tasks
  const q = query(tasksCollection);

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = querySnapshot.docs.map(doc => doc.data());
      console.log("snapshot", temp)
      setTasks(temp);
    });

    return () => unsubscribe();
  }, []);
  

  function handleToggleShowCompleted() {
    setIsShowCompleted(!isShowCompleted);
    console.log(tasks)
  }

  async function handleDeleteCompleted() {
    // const completedQ = query(tasksCollection, where("isCompleted", "==", true));
    // const completedTasks = await getDocs(completedQ);

    const completedTasks = tasks.filter((t) => t.isCompleted)

    completedTasks.forEach((t) => {
      tasksCollection.doc(t.id).delete();
    });
    // setTasks(tasks.filter(t => !t.isCompleted));
  }

  function handleChangeField(id, field, value) {
    // setTasks(tasks.map(
    //   t => t.id === id ? {...t, [field]: value} : t))
    console.log(id, field, value)
    setDoc(doc(db, collectionName, id),
    {
      [field]: value,
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
    })
  }

  function toggleModal() {
    setShowDeleteDialog(!isShowDeleteDialog)  
  }

  function handleDeleteById(id) {
    // setTasks(tasks.filter(t => !(t.id === id)))
  }

  // if (loading) {
  //   return <div>Loading</div>
  // }
  // if (error) {
  //     return <div>Error</div>
  // }
  return (
    <div className="App">
      <Header
        onToggleShowCompleted={handleToggleShowCompleted}
        onToggleModal={toggleModal}
        onDeleteCompleted={handleDeleteCompleted}
        isShowCompleted={isShowCompleted}
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
