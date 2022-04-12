import React from 'react';
import './NewListItem.css';
import { FaPencilAlt } from 'react-icons/fa';

function NewListItem(props) {

  function handleBlur(e) {
    if (e.target.value !== "") {
      props.onAddNewTask(e.target.value);
      console.log(e.target.value);
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