import React from 'react';
import { useState, useEffect } from 'react';
import { FaRegCircle, FaRegCheckCircle, FaExclamation } from 'react-icons/fa'
import './ListItem.css';

function ListItem(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [priority, setPriority] = useState(props.priority);
  const [text, setText] = useState(props.text)

  // update input text if props changes
  useEffect(() => {
    setText(props.text)
  }, [props.text])

  // update priority icons if props changes
  useEffect(() => {
    setPriority(props.priority)
  }, [props.priority])

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

  let priorityElements = isNaN(priority) ?
                         Array(1).fill(<FaExclamation />) :
                         Array(priority+1).fill(<FaExclamation />);

  return (
    <div className={"task-row" + ((props.isCompleted) ? " completed" : "")}>
      <div className="task-icon">
        <button className="icon-button" onClick={() => props.onToggleItemCompleted(props.id)}>
          {(props.isCompleted) ? <FaRegCheckCircle/> : <FaRegCircle/>}
        </button>
      </div>
      <input
        className="task-label"
        value={text}
        onFocus={e => setIsEditing(true)}
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
            if (isEditing) setPriority((priority+1)%3);
          }}
        >
          {priorityElements}
        </button>
      </div>
    </div>
  )
}

export default ListItem;