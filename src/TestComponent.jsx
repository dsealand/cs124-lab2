import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { getTasksByTabId } from './selectors';

const collection = "tabs-0"

function Tasks({name, owner, id}) {

  const tasks = getTasksByTabId(id);

  if (!isLoaded(tasks)) {
    return <div>Loading...</div>
  }

  if (isEmpty(tasks)) {
    return <div>no tasks</div>
  }

  return Object.entries(tasks).map(([id, task]) => 
    <p key={task.id}>
      {task.text}
    </p>)

}

function TestComponent() {

  const [activeTab, setActiveTab] = useState(false)

  useFirestoreConnect([
    { collection: "tabs-0" } // or 'todos'
  ])

  const tabs = useSelector((state) => state.firestore.ordered[collection] || [])
  // const fState = useSelector((state) => state.firestore)
  // console.log(fState)

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