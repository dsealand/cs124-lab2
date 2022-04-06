import React from 'react';
import { useState, useEffect } from 'react';
import { FaRegCircle, FaRegCheckCircle, FaExclamation } from 'react-icons/fa'
import './ListItem.css';

function ListItem(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(props.text)

  function handleBlur(e) {
    if (e.target.value === "") {
      props.onDeleteById(props.id);
    }
    else if (text !== props.text) {
      props.onChangeField(props.id, "text", e.target.value);
    }
    setIsEditing(false);
  }

  function handleFocus(e) {
    setIsEditing(true);
    setText(props.text);
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
            props.onChangeField(props.id, "priority", (props.priority%3)+1);
          }}
        >
          {Array(props.priority).fill(<FaExclamation />)}
        </button>
      </div>
    </div>
  )
}

export default ListItem;