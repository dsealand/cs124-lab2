import './Header.css';
import React from 'react';
import { useState } from 'react';
import { FaRegTrashAlt, FaRegEye, FaRegEyeSlash, FaSortAmountDown } from 'react-icons/fa';

import { useDispatch } from 'react-redux';
import { useFirestore } from "react-redux-firebase";
import { getSortOrder, getShowCompleted, getActiveTabID, getTasksByTabID } from '../../selectors';
import { setSortOrder, setShowCompleted } from '../../activeSlice'

function SortLabel({ field, name, isSelected, dir, onSortClick }) {

  function handleSortClick() {
    const newDir = (dir === "asc") ? "desc" : "asc";
    useDispatch()(setSortOrder([field, newDir]))
  }

  return <li onClick={e => { onSortClick(field) }}>
    <p 
      tabindex={0} 
      className={"sort-label " + (isSelected ? "selected" : "")}
      onKeyDown={(e) => {
        // TODO: change to constants?
        if (e.keyCode === 32 || e.keyCode === 13) e.target.click()
      }
      }
    >
      {name} {isSelected ? ((dir === "asc") ? '\u2191' : '\u2193') : ''}
    </p>
  </li>
}

function Header({setModal}) {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const fields = ["updated", "text", "priority"];
  const sortNames = {
    "updated": "Last Updated",
    "text": "Alphabetical",
    "priority": "Priority",
  };
  const [field, dir] = getSortOrder().split(" ");
  const isShowCompleted = getShowCompleted();
  const activeTabID = getActiveTabID();
  const firestore = useFirestore();

  function toggleSortMenu() {
    setShowSortMenu(!showSortMenu);
  }

  function createLabel(field, index) {
    return <SortLabel
      key={field}
      field={field}
      name={sortNames[field]}
      dir={dir}
      toggleSortMenu={toggleSortMenu}
    />
  }

  function deleteCompleted() {
    // TODO: constant for collection name
    const tasks = getTasksByTabID(activeTabID);
    for (const id in tasks) {
      firestore
        .collection("tabs-0")
        .doc(activeTabID)
        .collection("tasks")
        .doc(id)
        .delete()
    }
  }

  const modalOptions = {
    show: true,
    onClose: () => (setModal({ show: false })),
    onCancel: () => (setModal({ show: false })),
    cancelText: "Cancel",
    onConfirm: deleteCompleted,
    confirmText: "OK",
    children: "Delete all completed items?"
  }

  return (
    <div id="header">
      <div className="icon-eye icon-wrapper">
        <button
          aria-label={isShowCompleted ? 'hide completed tasks' : 'show completed tasks'}
          className="icon-button"
          onClick={() => useDispatch()(setShowCompleted(!isShowCompleted))}>
          {(isShowCompleted) ? <FaRegEye /> : <FaRegEyeSlash />}
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
          {sortNames[field]}
        </div>
      </div>
      <h3 className="header-name">Tasks</h3>
      <div className="spacing" />
      <div className="icon-trash icon-wrapper">
        <button 
          className="icon-button" 
          onClick={() => setModal(modalOptions)}
          aria-label="Delete completed items?">
          <FaRegTrashAlt />
        </button>
      </div>
    </div>
  )
}

export default Header;