import React from 'react';
import { useState } from 'react';
import { FaRegCircle, FaRegCheckCircle, FaExclamation } from 'react-icons/fa'
import './ListItem.css';

function ListItem(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [priority, setPriority] = useState(props.priority);

  function handleBlur(e) {
    if (e.target.value === "") {
      props.onDeleteById(props.id);
    }
    setIsEditing(false);
    props.onChangeField(props.id, "priority", priority);
    console.log("isEditing handleBlur", isEditing);
  }

  let priorityElements = isNaN(priority) ?
                         Array(1).fill(<FaExclamation></FaExclamation>) :
                         Array(priority+1).fill(<FaExclamation></FaExclamation>);

  return (
    <div className={"task-row" + ((props.isCompleted) ? " completed" : "")}>
      <div className="task-icon">
        <button className="icon-button" onClick={() => props.onToggleItemCompleted(props.id)}>
          {(props.isCompleted) ? <FaRegCheckCircle/> : <FaRegCircle/>}
        </button>
      </div>
      <input
        className="task-label"
        defaultValue={props.text}
        onFocus={(e) => {
          setIsEditing(true)
          console.log("isEditing onFocus", isEditing)}}
        onChange={e => {
          props.onChangeField(props.id, "text", e.target.value)
          setIsEditing(true)}}
        onBlur={handleBlur}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.target.blur()
          }
        }} />
      <div className="task-priority">
        {isEditing ?
        <button className="icon-button" onMouseDown={(e) => {e.preventDefault()
          setPriority((priority+1)%3);
          console.log("priority", priority)}}
        >
          {priorityElements}
        </button> : 
        <div className="icon-button">{priorityElements}</div>}
      </div>
    </div>
  )
}

export default ListItem;