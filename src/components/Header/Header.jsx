import './Header.css';
import React from 'react';
import { useState } from 'react';
import { FaRegTrashAlt, FaRegEye, FaRegEyeSlash, FaSortAmountDown } from 'react-icons/fa';

import { useDispatch } from 'react-redux';
import { useFirestore, useFirebase, isLoaded, isEmpty } from "react-redux-firebase";
import { getSortOrder, getShowCompleted, getActiveTabID, getTasksByTabID, getAuth } from '../../selectors';
import { setSortOrder, setShowCompleted } from '../../activeSlice';

import constants from '../../constants'

function SortLabel({ field, name }) {

  const dispatch = useDispatch();
  const [currentField, dir] = getSortOrder();
  const isSelected = field === currentField;

  function handleSortClick() {
    if (isSelected) {
      const newDir = (dir === "asc") ? "desc" : "asc";
      dispatch(setSortOrder([field, newDir]));
    }
    else if (field === "text") {
      dispatch(setSortOrder([field, "asc"]));
    }
    else {
      dispatch(setSortOrder([field, "desc"]));
    }
  }

  return <li onClick={handleSortClick}>
    <p 
      tabIndex={0} 
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
  const [field, dir] = getSortOrder();
  const isShowCompleted = getShowCompleted();
  const activeTabID = getActiveTabID();
  const auth = getAuth();

  if (isEmpty(auth)) {
    return (
      <div id="header">
        <h3 className="header-name">noteify</h3>
      </div>)
  }

  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const tasks = (isLoaded(activeTabID) && activeTabID) ? getTasksByTabID(activeTabID) : [];


  function toggleSortMenu() {
    setShowSortMenu(!showSortMenu);
  }

  function toggleShowCompleted() {
    dispatch(setShowCompleted(!isShowCompleted))
  }

  function createLabel(field, index) {
    return <SortLabel
      key={field}
      field={field}
      name={sortNames[field]}
      toggleSortMenu={toggleSortMenu}
    />
  }

  function deleteCompleted() {
    // TODO: constant for collection name
    for (const task of tasks) {
      if (task.isCompleted) {
        firestore
          .collection(constants.TABS_COLLECTION)
          .doc(activeTabID)
          .collection(constants.TASKS_COLLECTION)
          .doc(task.id)
          .delete()
      }
    }
  }

  const deleteModalOptions = {
    show: true,
    onClose: () => (setModal({ show: false })),
    onCancel: () => (setModal({ show: false })),
    cancelText: "Cancel",
    onConfirm: deleteCompleted,
    confirmText: "OK",
    children: "Delete all completed items?"
  }

  function logout() {
    firebase.logout();
  }

  const logoutModalOptions = {
    show: true,
    onClose: () => (setModal({ show: false })),
    onCancel: () => (setModal({ show: false })),
    cancelText: "Cancel",
    onConfirm: logout,
    confirmText: "Log out",
    children: "Are you sure you want to log out?"
  }

  return (
    <div id="header">
      <div className="icon-eye icon-wrapper">
        <button
          aria-label={isShowCompleted ? 'hide completed tasks' : 'show completed tasks'}
          className="icon-button"
          onClick={toggleShowCompleted}>
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
      <h3 className="header-name"
        onClick={() => setModal(logoutModalOptions)}>noteify</h3>
      <div className="spacing" />
      <div className="icon-trash icon-wrapper">
        <button 
          className="icon-button" 
          onClick={() => setModal(deleteModalOptions)}
          aria-label="Delete completed items?">
          <FaRegTrashAlt />
        </button>
      </div>
    </div>
  )
}

export default Header;