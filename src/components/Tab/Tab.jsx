import './Tab.css';
import React from 'react';
import { FaWindowClose } from 'react-icons/fa';

export default function Tab(props) {
  const modalOptions = {
    show: true,
    onClose: () => (props.setModal({show:false})),
    onCancel: () => (props.setModal({show:false})),
    cancelText: "Cancel",
    onConfirm: () => props.deleteTab(props.id),
    confirmText: "OK",
    children: `Delete ${props.label} tab?`
    }

  const classNames = ["tab-list-item"];
  if (props.activeTab === props.id) {
    classNames.push("tab-list-active");
  }
  return (
    <li 
      className={classNames.join(" ")}
      role="button"
      tabIndex={0}
      onClick={() => {
          props.onClickTab(props.id)
      }}
      onKeyDown={(e) => {
        if (e.keyCode === 32 || e.keyCode === 13) e.target.click()
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