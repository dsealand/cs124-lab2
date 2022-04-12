import './Header.css';
import React from 'react';
import { useState } from 'react';
import { FaRegTrashAlt, FaRegEye, FaRegEyeSlash, FaSortAmountDown } from 'react-icons/fa';

function SortLabel({ field, name, isSelected, dir, onSortClick }) {

  return <li onClick={e => { onSortClick(field) }}>
    <p 
      tabindex={0} 
      className={"sort-label " + (isSelected ? "selected" : "")}
      onKeyDown={(e) => {
        if (e.keyCode === 32 || e.keyCode === 13) e.target.click()
      }
      }
    >
      {name} {isSelected ? ((dir === "asc") ? '\u2191' : '\u2193') : ''}
    </p>
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
      newOrder = [field, (currentDir === "asc") ? "desc" : "asc"].join(" ");
    }

    else if (field === "text") {
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
      isSelected={(currentField === field)}
      onSortClick={handleSortClick}
    />
  }

  const properSortName = {
    "updated desc": "Last Updated",
    "updated asc": "Last Updated",
    "text desc": "Alphabetical",
    "text asc": "Alphabetical",
    "priority desc": "Priority",
    "priority asc": "Priority"
  };

  const modalOptions = {
    show: true,
    onClose: () => (props.setModal({ show: false })),
    onCancel: () => (props.setModal({ show: false })),
    cancelText: "Cancel",
    onConfirm: props.onDeleteCompleted,
    confirmText: "OK",
    children: "Delete all completed items?"
  }

  return (
    <div id="header">
      <div className="icon-eye icon-wrapper">
        <button
          aria-label={props.isShowCompleted ? 'hide completed tasks' : 'show completed tasks'}
          className="icon-button"
          onClick={props.onToggleShowCompleted}>
          {(props.isShowCompleted) ? <FaRegEye /> : <FaRegEyeSlash />}
        </button>
      </div>
      <div className="header-sort">
        <div className="sort-icon">
          <button aria-label={showSortMenu ? 'hide sort menu' : 'show sort menu'} className="icon-button" onClick={(e) => {
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
        <div className="display-lg">
          {properSortName[props.sortOrder]}
        </div>
      </div>
      <h3 className="header-name">Tasks</h3>
      <div className="spacing" />
      <div className="icon-trash icon-wrapper">
        <button 
          className="icon-button" 
          onClick={() => props.setModal(modalOptions)}
          aria-label="Delete completed items?">
          <FaRegTrashAlt />
        </button>
      </div>
    </div>
  )
}

export default Header;