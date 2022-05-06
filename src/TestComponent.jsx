import React, {Fragment} from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useFirestore, useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { getTasksByTabID } from './selectors';

const collection = "tabs-0"

function Tasks({name, owner, id}) {

  const tasks = getTasksByTabID(id);
  const firestore = useFirestore();

  if (!isLoaded(tasks)) {
    return <div>Loading...</div>
  }

  if (isEmpty(tasks)) {
    return <div>no tasks</div>
  }

  function handleDelete(taskID) {
    firestore
      .collection(collection)
      .doc(id)
      .collection("tasks")
      .doc(taskID)
      .delete();
  }

  return Object.entries(tasks).map(([id, task]) =>
    <Fragment key={task.id}>
      <p>
        {task.text}
      </p>
      <button onClick={() => handleDelete(id)}>
        delete
      </button>      
    </Fragment>)

}

function TestComponent() {

  const [activeTab, setActiveTab] = useState(false)

  useFirestoreConnect([
    { collection: "tabs-0" } // or 'todos'
  ])

  const tabs = useSelector((state) => state.firestore.ordered[collection] || [])

  const buttons = tabs.map(tab => 
    <button 
      key={tab.id} 
      type="button" 
      onClick={() => setActiveTab(tab)}>
      select {tab.name}
    </button>
  )

  return <>
    {activeTab?
      <>
        <p>{activeTab.name}</p>
        <Tasks {...activeTab}/>
      </>
    :"no active tab"}
    <br/>
    {buttons}
  </>

}

export default TestComponent;