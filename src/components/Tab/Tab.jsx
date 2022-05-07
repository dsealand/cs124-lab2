import './Tab.css';
import React from 'react';
import { FaWindowClose } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useFirestore } from "react-redux-firebase";
import { setActiveTabID } from '../../activeSlice';
import { getActiveTabID, getTasksByTabID } from '../../selectors';
import constants from '../../constants'

function Tab(props) {

  const firestore = useFirestore();
  const activeTab = getActiveTabID();
  const dispatch = useDispatch();
  const tasks = getTasksByTabID(props.id);


  function deleteTab() {

    for (const taskID in tasks) {
      firestore
        .collection(constants.TABS_COLLECTION)
        .doc(props.id)
        .collection(constants.TASKS_COLLECTION)
        .doc(taskID).delete();
    }

    firestore
      .collection(constants.TABS_COLLECTION)
      .doc(props.id).delete();
    dispatch(setActiveTabID(null))
  }

  function selectTab(id) {
    dispatch(setActiveTabID(id));
  }

  const modalOptions = {
    show: true,
    onClose: () => (props.setModal({show:false})),
    onCancel: () => (props.setModal({show:false})),
    cancelText: "Cancel",
    onConfirm: deleteTab,
    confirmText: "OK",
    children: `Delete ${props.label} tab?`
    }

  const classNames = ["tab-list-item"];
  if (activeTab === props.id) {
    classNames.push("tab-list-active");
  }
  return (
    <li 
      className={classNames.join(" ")}
      role="button"
      tabIndex={0}
      onClick={() => {
          selectTab(props.id)
      }}
      onKeyDown={(e) => {
        if (constants.ARIA_KEYS.includes(e.key)) e.target.click()
      }}
      aria-label={`Select ${props.label} tab`}>
      <div
        className="tab-name"
        >
        {props.label}
      </div>
      <button 
        aria-label={`Delete ${props.label} tab`} 
        className="icon-button" 
        onClick={() => { props.setModal(modalOptions) }}>
        <FaWindowClose />
      </button>
    </li>
  )
}

export default Tab;