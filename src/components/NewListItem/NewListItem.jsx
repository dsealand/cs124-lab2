import React from 'react';
import './NewListItem.css';
import { FaPencilAlt } from 'react-icons/fa';
import { useFirestore } from 'react-redux-firebase';
import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";
import { getActiveTabID } from '../../selectors';

function NewListItem(props) {
  const firestore = useFirestore();
  const activeTab = getActiveTabID();

  function handleNewTask(task) {
    const updated = new Date();
    firestore
      .collection('tabs-0')
      .doc(activeTab)
      .collection('tasks')
      .doc()
      .set({
        text: task,
        isCompleted: false,
        priority: 1,
        updated: updated.toISOString()
      });
  }

  function handleBlur(e) {
    if (e.target.value !== "") {
      handleNewTask(e.target.value);
      document.getElementById("newTaskInput").value = "";
    }
  }

  function handleButtonClick() {
    document.getElementById("newTaskInput").focus()
  }

  return (
    <div className="task-row new">
      <div className="task-icon">
        <button 
          className="icon-button" 
          onClick={handleButtonClick}
          aria-label="Add new task">
          <FaPencilAlt/>
        </button>
      </div>
      <input
        id="newTaskInput"
        className="task-label"
        defaultValue=""
        placeholder="Create new task"
        onBlur={handleBlur}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.target.blur()
          }
        }}
      />
    </div>
  )
}

export default NewListItem;