import React from 'react';
import { useState, useEffect } from 'react';
import { FaRegCircle, FaRegCheckCircle, FaExclamation } from 'react-icons/fa'
import './ListItem.css';

function ListItem(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [priority, setPriority] = useState(props.priority);
  const [text, setText] = useState(props.text)

  function handleBlur(e) {
    if (e.target.value === "") {
      props.onDeleteById(props.id);
    }
    else {
      props.onChangeField(props.id, "priority", priority);
      props.onChangeField(props.id, "text", e.target.value)
    }
    setIsEditing(false);
  }

  return (
    <div className={"task-row" + ((props.isCompleted) ? " completed" : "")}>
      <div className="task-icon">
        <button className="icon-button" onClick={() => props.onToggleItemCompleted(props.id)}>
          {(props.isCompleted) ? <FaRegCheckCircle/> : <FaRegCircle/>}
        </button>
      </div>
      <input
        className="task-label"
        value={isEditing?text:props.text}
        onFocus={e => {setIsEditing(true)
                       setPriority(props.priority)
                       setText(props.text)}}
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
          onMouseDown={(e) => {
            e.preventDefault();
            if (isEditing) setPriority((priority%3)+1);
          }}
        >
          {Array(priority).fill(<FaExclamation />)}
        </button>
      </div>
    </div>
  )
}

export default ListItem;