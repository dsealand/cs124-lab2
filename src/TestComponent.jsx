import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

const collection = "tabs-0"

function Tasks({name, owner, id}) {
  
  console.log("adding listener");
  useFirestoreConnect([
    { collection: "tabs-0",
      doc: id,
      subcollections: [{ collection: 'tasks'}],
      storeAs: `${id}-tasks`
    }
  ])
  console.log("listening to " + id);

  const tasks = useSelector(({ firestore: { data } }) => data[`${id}-tasks`])
  console.log("firestore data", useSelector(state => state.firestore.data));

  console.log("tasks", tasks)
  return tasks ? Object.entries(tasks).map(([id, task]) => 
    <p key={task.id}>
      {task.text}
    </p>):null;

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