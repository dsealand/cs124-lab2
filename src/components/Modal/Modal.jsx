import React from 'react';
import { useEffect, useRef } from "react";

function Modal({cancelText, onCancel, confirmText, onConfirm, onClose, children}) {

  const focus = useRef(null)
  useEffect(() => {
    focus.current.focus();
  },[])

  return (
    <div className={"backdrop"} onClick={onClose}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
      >
        {children}
        <div className="alert-buttons">
          <button 
            aria-label={'cancel '+children} 
            className={"alert-button alert-cancel"} 
            type={"button"}
            ref={focus}
            onClick={() => {
              onCancel();
              onClose();
            }}>
            {cancelText}
          </button>
          <button aria-label={'confirm '+children} className={"alert-button alert-ok"} type={"button"}
            onClick={() => {
              onConfirm();
              onClose();
            }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal;