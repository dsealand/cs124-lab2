import React from 'react';
import { useState } from 'react';
import { FaRegCircle, FaRegCheckCircle, FaExclamation } from 'react-icons/fa';
import './ListItem.css';
import { useFirestore } from 'react-redux-firebase';
import { getActiveTabID } from '../../selectors';

function ListItem(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(props.text);
  const [completed, setCompleted] = useState(props.isCompleted)
  const [priority, setPriority] = useState(props.priority);

  const activeTab = getActiveTabID();

  const firestore = useFirestore();

  function handleBlur(e) {
    if (e.target.value === "") {
      handleDelete(props.id);
    }
    else if (text !== props.text) {
      handleUpdate(props.id, "text", e.target.value);
    }
    setIsEditing(false);
  }

  function handleFocus(e) {
    setIsEditing(true);
    setText(props.text);
  }

  function handleUpdate(id, field, value) {
    firestore
      .collection('tabs-1')
      .doc(activeTab)
      .collection('tasks')
      .doc(id)
      .update({
        [field]: value,
        updated: serverTimestamp().toDate().toISOString()
      });
  }

  function handleDelete(id) {
    firestore
      .collection('tabs-1')
      .doc(activeTab)
      .collection('tasks')
      .doc(id)
      .delete()
  }

  return (
    <div className={"task-row" + ((completed) ? " completed" : "")}>
      <div className="task-icon">
        <button 
          className="icon-button" 
          onClick={() => {
            handleUpdate(props.id, 'isCompleted', !completed);
            setCompleted(!completed);
        }}
          aria-label={`Complete ${text}`}
          >
          {(completed) ? <FaRegCheckCircle/> : <FaRegCircle/>}
        </button>
      </div>
      <input
        className="task-label"
        value={isEditing?text:props.text}
        autoComplete="off"
        onFocus={handleFocus}
        onChange={e => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.target.blur()
          }
        }} />
      <div className="task-priority">
        <button 
          className="icon-button" 
          onClick={(e) => {
            handleUpdate(props.id, "priority", (priority%3)+1);
            setPriority((priority%3)+1);
          }}
          aria-label={`Priority of ${text} is ${priority}. Change to ${(priority%3)+1}?`}
        >
          {Array(priority).fill(<FaExclamation />)}
        </button>
      </div>
    </div>
  )
}

export default ListItem;