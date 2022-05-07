import React, {useState} from 'react';
import { FaRegCircle, FaRegCheckCircle, FaExclamation } from 'react-icons/fa';
import './ListItem.css';
import constants from '../../constants';

import { useFirestore } from 'react-redux-firebase';

function ListItem({id, isCompleted, priority, activeTab, ...props}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(props.text);

  // const activeTab = getActiveTabID();

  const firestore = useFirestore();

  function handleBlur(e) {
    if (e.target.value === "") {
      handleDelete(props.id);
    }
    else if (text !== props.text) {
      handleUpdate(id, "text", e.target.value);
    }
    setIsEditing(false);
  }

  function handleFocus(e) {
    setIsEditing(true);
    setText(props.text);
  }

  function handleUpdate(id, field, value) {
    const updated = new Date()
    firestore
      .collection(constants.TABS_COLLECTION)
      .doc(activeTab)
      .collection(constants.TASKS_COLLECTION)
      .doc(id)
      .update({
        [field]: value,
        updated: updated.toISOString()
      });
  }

  function handleDelete(id) {
    firestore
      .collection(constants.TABS_COLLECTION)
      .doc(activeTab)
      .collection(constants.TASKS_COLLECTION)
      .doc(id)
      .delete()
  }

  return (
    <div className={"task-row" + ((isCompleted) ? " completed" : "")}>
      <div className="task-icon">
        <button 
          className="icon-button" 
          onClick={() => {
            handleUpdate(id, 'isCompleted', !isCompleted);
        }}
          aria-label={`Complete ${text}`}
          >
          {(isCompleted) ? <FaRegCheckCircle/> : <FaRegCircle/>}
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
            handleUpdate(id, "priority", (priority%3)+1);
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