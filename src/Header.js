import './Header.css';
import React from 'react';
import { useState } from 'react';
import { FaRegTrashAlt, FaRegEye, FaRegEyeSlash, FaSortAmountDown } from 'react-icons/fa';

function SortLabel({field, name, isSelected, dir, onSortClick}) {

  return <li onClick={e => {onSortClick(field)}}>
    <p className={"sort-label " + (isSelected?"selected":"")}>{name} {isSelected?((dir==="asc")?'\u2191':'\u2193'):''}</p>
  </li>
}

function Header(props) {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const fields = ["updated", "text", "priority"];
  const names = ["Last Updated", "Alphabetical", "Priority"];
  const [currentField, currentDir] = props.sortOrder.split(" ")


  function handleSortClick(field) {
    let newOrder = "";

    if (field === currentField) {
      newOrder = [field, (currentDir=="asc")?"desc":"asc"].join(" ");
    }

    else if (field === "text")  {
      newOrder = [field, "asc"].join(" ");
    }

    else {
      newOrder = [field, "desc"].join(" ");
    }
    props.setSortOrder(newOrder);
    setShowSortMenu(false);  
  }

  function createLabel(field, index) {
    return <SortLabel
      key={field}
      field={field}
      name={names[index]}
      dir={currentDir}
      isSelected={(currentField===field)}
      onSortClick={handleSortClick}
    />
  }

  return (
    <div id="header">
      <div className="header-icon">
        <div className="task-icon">
          <button className="icon-button" onClick={props.onToggleShowCompleted}>
            {(props.isShowCompleted) ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>
      </div>
      <div className="header-sort">
        <div className="sort-icon">
          <button className="icon-button" onClick={(e) => {
            setShowSortMenu(!showSortMenu);
          }}>
            <FaSortAmountDown></FaSortAmountDown>
          </button>
          {showSortMenu && <div className="backdrop" onClick={e => setShowSortMenu(false)}>
            <div className="dropdown">
              <ul>
                {fields.map(createLabel)}
              </ul>
            </div>
          </div>
          }
        </div>
      </div>
      <h3>Tasks</h3>
      <div className="trash-icon">
        <button className="icon-button" onClick={() => props.onToggleModal()}>
          <FaRegTrashAlt />
        </button>
      </div>
    </div>
  )
}

export default Header;